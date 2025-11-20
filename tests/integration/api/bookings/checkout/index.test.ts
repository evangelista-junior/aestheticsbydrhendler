/**
 * @jest-environment node
 */

jest.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn(),
        retrieve: jest.fn(),
      },
    },
  },
}));

jest.mock("@/lib/jwt", () => ({
  decodeToken: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    tokensJWT: {
      findUnique: jest.fn(),
    },
    paymentTokens: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    treatments: {
      findFirst: jest.fn(),
    },
  },
}));

jest.mock("@/lib/utils/isValidUUID", () => ({
  isValidUUID: jest.fn(),
}));

import { GET } from "@/app/api/v1/bookings/checkout/route";
import { stripe } from "@/lib/stripe";
import { decodeToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { isValidUUID } from "@/lib/utils/isValidUUID";

const makeRequest = (url: string, { headers = {} } = {}) => {
  return new Request(url, {
    method: "GET",
    headers: {
      ...headers,
    },
  });
};

describe("GET /api/v1/bookings/checkout", () => {
  const OLD_ENV = process.env;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  beforeAll(() => {
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.API_KEY = "test-api-key";
    process.env.NEXT_PUBLIC_APP_URL = "https://example.com";

    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  });

  describe("Authentication and Booking ID validation", () => {
    test("Return 401 if x-api-key is invalid", async () => {
      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout?id=uuid",
        {
          headers: {
            "x-api-key": "wrong-key",
          },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(401);
      expect(body).toEqual({ ok: false, message: "Access denied!" });
    });

    test("Return 401 if x-api-key is not given", async () => {
      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout?id=uuid",
        {
          headers: {},
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(401);
      expect(body).toEqual({ ok: false, message: "Access denied!" });
    });

    test("Return 400 if UUID is invalid", async () => {
      (isValidUUID as jest.Mock).mockReturnValue(false);

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout?id=invalid-uuid",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(isValidUUID).toHaveBeenCalledWith("invalid-uuid");
      expect(res.status).toBe(400);
      expect(body).toEqual({
        ok: false,
        message: "UUID is not valid",
      });
    });

    test("Return 400 if ID (parameter) is not given", async () => {
      (isValidUUID as jest.Mock).mockReturnValue(false);

      const req = makeRequest("https://example.com/api/v1/bookings/checkout", {
        headers: {
          "x-api-key": process.env.API_KEY,
        },
      });

      const res = await GET(req);
      const body = await res.json();

      expect(isValidUUID).toHaveBeenCalledWith(null);
      expect(res.status).toBe(400);
      expect(body).toEqual({
        ok: false,
        message: "UUID is not valid",
      });
    });
  });

  describe("JWT token validation", () => {
    test("Return 404 if booking (tokenJWT) is not found", async () => {
      (isValidUUID as jest.Mock).mockReturnValue(true);
      (prisma.tokensJWT.findUnique as jest.Mock).mockResolvedValue(null);

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout?id=some-uuid",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(prisma.tokensJWT.findUnique).toHaveBeenCalledWith({
        where: { id: "some-uuid" },
      });
      expect(res.status).toBe(404);
      expect(body).toEqual({ ok: false, message: "Booking not found" });
    });

    test("Return 400 if JWT token is not valid", async () => {
      (isValidUUID as jest.Mock).mockReturnValue(true);
      (prisma.tokensJWT.findUnique as jest.Mock).mockResolvedValue({
        id: "some-uuid",
        token: "fake-jwt",
      });
      (decodeToken as jest.Mock).mockResolvedValue({
        valid: false,
        payload: null,
      });

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout?id=some-uuid",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(decodeToken).toHaveBeenCalledWith("fake-jwt");
      expect(res.status).toBe(400);
      expect(body).toEqual({
        ok: false,
        message:
          "This payment link has expired for security reasons. Please start a new booking process.",
      });
    });

    test("Return 400 if JWT token has expired", async () => {
      (isValidUUID as jest.Mock).mockReturnValue(true);
      (prisma.tokensJWT.findUnique as jest.Mock).mockResolvedValue({
        id: "some-uuid",
        token: "expired-jwt",
      });
      (decodeToken as jest.Mock).mockResolvedValue({
        valid: false,
        payload: { jti: "jti-123", exp: Date.now() - 10000 },
      });

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout?id=some-uuid",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body).toEqual({
        ok: false,
        message:
          "This payment link has expired for security reasons. Please start a new booking process.",
      });
    });
  });

  describe("PaymentToken validation", () => {
    test("Return 404 if paymentTokenInfo is not found", async () => {
      (isValidUUID as jest.Mock).mockReturnValue(true);
      (prisma.tokensJWT.findUnique as jest.Mock).mockResolvedValue({
        id: "some-uuid",
        token: "fake-jwt",
      });
      (decodeToken as jest.Mock).mockResolvedValue({
        valid: true,
        payload: { jti: "jti-123" },
      });
      (prisma.paymentTokens.findUnique as jest.Mock).mockResolvedValue(null);

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout?id=some-uuid",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(prisma.paymentTokens.findUnique).toHaveBeenCalledWith({
        where: { jti: "jti-123" },
        select: {
          email: true,
          service: true,
          providerRef: true,
          status: true,
          usedAt: true,
        },
      });
      expect(res.status).toBe(404);
      expect(body).toEqual({ ok: false, message: "Patient not found" });
    });

    test("Return 409 if payment is already complete (usedAt filled)", async () => {
      (isValidUUID as jest.Mock).mockReturnValue(true);
      (prisma.tokensJWT.findUnique as jest.Mock).mockResolvedValue({
        id: "some-uuid",
        token: "fake-jwt",
      });
      (decodeToken as jest.Mock).mockResolvedValue({
        valid: true,
        payload: { jti: "jti-123" },
      });
      (prisma.paymentTokens.findUnique as jest.Mock).mockResolvedValue({
        email: "test@example.com",
        service: "Service X",
        providerRef: "stripe-session-id",
        status: "paid",
        usedAt: new Date(),
      });

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout?id=some-uuid",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(409);
      expect(body).toEqual({
        ok: false,
        message: "Payment already complete!",
      });
    });
  });

  describe("Retrieving existing and valid Stripe session", () => {
    test("Return client_secret if providerRef exists and status is not expired", async () => {
      (isValidUUID as jest.Mock).mockReturnValue(true);
      (prisma.tokensJWT.findUnique as jest.Mock).mockResolvedValue({
        id: "some-uuid",
        token: "fake-jwt",
      });
      (decodeToken as jest.Mock).mockResolvedValue({
        valid: true,
        payload: { jti: "jti-123" },
      });
      (prisma.paymentTokens.findUnique as jest.Mock).mockResolvedValue({
        email: "test@example.com",
        service: "Service X",
        providerRef: "stripe-session-id",
        status: "pending",
        usedAt: null,
      });
      (stripe.checkout.sessions.retrieve as jest.Mock).mockResolvedValue({
        id: "stripe-session-id",
        client_secret: "cs_test_123",
      });

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout?id=some-uuid",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(stripe.checkout.sessions.retrieve).toHaveBeenCalledWith(
        "stripe-session-id"
      );
      expect(res.status).toBe(200);
      expect(body).toEqual({
        ok: true,
        client_secret: "cs_test_123",
      });
    });

    test("Create a new session if Stripe retrieve fails (session not found)", async () => {
      (isValidUUID as jest.Mock).mockReturnValue(true);
      (prisma.tokensJWT.findUnique as jest.Mock).mockResolvedValue({
        id: "some-uuid",
        token: "fake-jwt",
      });
      (decodeToken as jest.Mock).mockResolvedValue({
        valid: true,
        payload: { jti: "jti-123" },
      });
      (prisma.paymentTokens.findUnique as jest.Mock).mockResolvedValue({
        email: "test@example.com",
        service: "Service X",
        providerRef: "invalid-stripe-session-id",
        status: "pending",
        usedAt: null,
      });
      (stripe.checkout.sessions.retrieve as jest.Mock).mockRejectedValue(
        new Error("Session not found")
      );
      (prisma.treatments.findFirst as jest.Mock).mockResolvedValue({
        stripeProductNumber: "price_123",
      });
      (stripe.checkout.sessions.create as jest.Mock).mockResolvedValue({
        id: "new-stripe-session-id",
        client_secret: "cs_test_new",
      });

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout?id=some-uuid",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(stripe.checkout.sessions.retrieve).toHaveBeenCalledWith(
        "invalid-stripe-session-id"
      );
      expect(stripe.checkout.sessions.create).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(body).toEqual({ ok: true, client_secret: "cs_test_new" });
    });
  });

  describe("Stripe new session creation", () => {
    test("Return 400 if treatment is not found", async () => {
      (isValidUUID as jest.Mock).mockReturnValue(true);
      (prisma.tokensJWT.findUnique as jest.Mock).mockResolvedValue({
        id: "some-uuid",
        token: "fake-jwt",
      });
      (decodeToken as jest.Mock).mockResolvedValue({
        valid: true,
        payload: { jti: "jti-123" },
      });
      (prisma.paymentTokens.findUnique as jest.Mock).mockResolvedValue({
        email: "test@example.com",
        service: "Service X",
        providerRef: null,
        status: "pending",
        usedAt: null,
      });
      (prisma.treatments.findFirst as jest.Mock).mockResolvedValue(null);

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout?id=some-uuid",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(prisma.treatments.findFirst).toHaveBeenCalledWith({
        where: { name: "Service X" },
        select: { stripeProductNumber: true },
      });
      expect(res.status).toBe(400);
      expect(body).toEqual({
        ok: false,
        message: "Treatment not found or not configured",
      });
    });

    test("Return 400 if treatment does not have stripeProductNumber", async () => {
      (isValidUUID as jest.Mock).mockReturnValue(true);
      (prisma.tokensJWT.findUnique as jest.Mock).mockResolvedValue({
        id: "some-uuid",
        token: "fake-jwt",
      });
      (decodeToken as jest.Mock).mockResolvedValue({
        valid: true,
        payload: { jti: "jti-123" },
      });
      (prisma.paymentTokens.findUnique as jest.Mock).mockResolvedValue({
        email: "test@example.com",
        service: "Service X",
        providerRef: null,
        status: "pending",
        usedAt: null,
      });
      (prisma.treatments.findFirst as jest.Mock).mockResolvedValue({
        stripeProductNumber: null,
      });

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout?id=some-uuid",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body).toEqual({
        ok: false,
        message: "Treatment not found or not configured",
      });
    });

    test("Should create a new Stripe session and return client_secret (happy path)", async () => {
      (isValidUUID as jest.Mock).mockReturnValue(true);
      (prisma.tokensJWT.findUnique as jest.Mock).mockResolvedValue({
        id: "some-uuid",
        token: "fake-jwt",
      });
      (decodeToken as jest.Mock).mockResolvedValue({
        valid: true,
        payload: { jti: "jti-123" },
      });
      (prisma.paymentTokens.findUnique as jest.Mock).mockResolvedValue({
        email: "test@example.com",
        service: "Service X",
        providerRef: null,
        status: "pending",
        usedAt: null,
      });
      (prisma.treatments.findFirst as jest.Mock).mockResolvedValue({
        stripeProductNumber: "price_123",
      });
      (stripe.checkout.sessions.create as jest.Mock).mockResolvedValue({
        id: "stripe-session-id",
        client_secret: "cs_test_456",
      });
      (prisma.paymentTokens.update as jest.Mock).mockResolvedValue({});

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout?id=some-uuid",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith({
        mode: "payment",
        ui_mode: "embedded",
        customer_email: "test@example.com",
        submit_type: "pay",
        line_items: [
          {
            price: "price_123",
            quantity: 1,
          },
        ],
        return_url:
          "https://example.com/bookings/checkout/success?session_id={CHECKOUT_SESSION_ID}",
      });

      expect(prisma.paymentTokens.update).toHaveBeenCalledWith({
        where: {
          jti: "jti-123",
        },
        data: {
          providerRef: "stripe-session-id",
        },
      });

      expect(res.status).toBe(200);
      expect(body).toEqual({ ok: true, client_secret: "cs_test_456" });
    });

    test("Return 400 if Stripe throws an error when creating session", async () => {
      (isValidUUID as jest.Mock).mockReturnValue(true);
      (prisma.tokensJWT.findUnique as jest.Mock).mockResolvedValue({
        id: "some-uuid",
        token: "fake-jwt",
      });
      (decodeToken as jest.Mock).mockResolvedValue({
        valid: true,
        payload: { jti: "jti-123" },
      });
      (prisma.paymentTokens.findUnique as jest.Mock).mockResolvedValue({
        email: "test@example.com",
        service: "Service X",
        providerRef: null,
        status: "pending",
        usedAt: null,
      });
      (prisma.treatments.findFirst as jest.Mock).mockResolvedValue({
        stripeProductNumber: "price_123",
      });
      (stripe.checkout.sessions.create as jest.Mock).mockRejectedValue(
        new Error("Stripe failure")
      );

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout?id=some-uuid",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body).toEqual({
        ok: false,
        message: "Stripe or Prisma (update paymentToken.update) went on error",
      });
    });

    test("Return 400 with generic message if Stripe throws error without message", async () => {
      (isValidUUID as jest.Mock).mockReturnValue(true);
      (prisma.tokensJWT.findUnique as jest.Mock).mockResolvedValue({
        id: "some-uuid",
        token: "fake-jwt",
      });
      (decodeToken as jest.Mock).mockResolvedValue({
        valid: true,
        payload: { jti: "jti-123" },
      });
      (prisma.paymentTokens.findUnique as jest.Mock).mockResolvedValue({
        email: "test@example.com",
        service: "Service X",
        providerRef: null,
        status: "pending",
        usedAt: null,
      });
      (prisma.treatments.findFirst as jest.Mock).mockResolvedValue({
        stripeProductNumber: "price_123",
      });
      (stripe.checkout.sessions.create as jest.Mock).mockRejectedValue({});

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout?id=some-uuid",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body).toEqual({
        ok: false,
        message: "Stripe or Prisma (update paymentToken.update) went on error",
      });
    });
  });

  describe("General error handling", () => {
    test("Return 500 if any unexpected error occurs in the server", async () => {
      (isValidUUID as jest.Mock).mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout?id=some-uuid",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body).toEqual({
        ok: false,
        message: "Something went wrong on the server!",
      });
    });

    test("Return 500 if prisma.tokensJWT.findUnique throws an error", async () => {
      (isValidUUID as jest.Mock).mockReturnValue(true);
      (prisma.tokensJWT.findUnique as jest.Mock).mockRejectedValue(
        new Error("Databaif error")
      );

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout?id=some-uuid",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body).toEqual({
        ok: false,
        message: "Something went wrong on the server!",
      });
    });

    test("Return 500 if decodeToken throws an error", async () => {
      (isValidUUID as jest.Mock).mockReturnValue(true);
      (prisma.tokensJWT.findUnique as jest.Mock).mockResolvedValue({
        id: "some-uuid",
        token: "fake-jwt",
      });
      (decodeToken as jest.Mock).mockRejectedValue(
        new Error("JWT decode error")
      );

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout?id=some-uuid",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body).toEqual({
        ok: false,
        message: "Something went wrong on the server!",
      });
    });

    test("Return 400 if prisma.paymentTokens.update throws an error", async () => {
      (isValidUUID as jest.Mock).mockReturnValue(true);
      (prisma.tokensJWT.findUnique as jest.Mock).mockResolvedValue({
        id: "some-uuid",
        token: "fake-jwt",
      });
      (decodeToken as jest.Mock).mockResolvedValue({
        valid: true,
        payload: { jti: "jti-123" },
      });
      (prisma.paymentTokens.findUnique as jest.Mock).mockResolvedValue({
        email: "test@example.com",
        service: "Service X",
        providerRef: null,
        status: "pending",
        usedAt: null,
      });
      (prisma.treatments.findFirst as jest.Mock).mockResolvedValue({
        stripeProductNumber: "price_123",
      });
      (stripe.checkout.sessions.create as jest.Mock).mockResolvedValue({
        id: "stripe-session-id",
        client_secret: "cs_test_456",
      });
      (prisma.paymentTokens.update as jest.Mock).mockRejectedValue(
        new Error("Update error")
      );

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout?id=some-uuid",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body).toEqual({
        ok: false,
        message: "Stripe or Prisma (update paymentToken.update) went on error",
      });
    });
  });
});
