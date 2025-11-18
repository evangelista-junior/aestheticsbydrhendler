jest.mock("@/lib/prisma", () => ({
  prisma: {
    paymentTokens: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    tokensJWT: {
      create: jest.fn(),
    },
    treatments: {
      findFirst: jest.fn(),
    },
  },
}));

jest.mock("@/lib/jwt", () => ({
  createToken: jest.fn(),
}));

jest.mock("@/lib/mailer", () => ({
  sendMail: jest.fn(),
}));

jest.mock("@/lib/stripe", () => ({
  stripe: {
    prices: {
      retrieve: jest.fn(),
    },
  },
}));

jest.mock("@/lib/utils/dateFormater", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/utils/generateUUID", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/utils/parseEmailConsultationRequest", () => ({
  parseEmailConsultationRequest: jest.fn(),
}));

jest.mock("node:fs/promises", () => ({
  readFile: jest.fn(),
}));

jest.mock("node:path", () => ({
  join: jest.fn(() => "/fake/path"),
}));

import { POST } from "@/app/api/v1/bookings/route";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/jwt";
import { stripe } from "@/lib/stripe";
import dateFormater from "@/lib/utils/dateFormater";
import generateUUID from "@/lib/utils/generateUUID";
import { parseEmailConsultationRequest } from "@/lib/utils/parseEmailConsultationRequest";
import fs from "node:fs/promises";
import { sendMail } from "@/lib/mailer";

function createRequest({ body, headers = {} }) {
  return new Request("http://localhost/api/v1/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/v1/bookings", () => {
  const OLD_ENV = process.env;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  beforeAll(() => {
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV };
    process.env.API_KEY = "test-api-key";
    process.env.NEXT_PUBLIC_APP_URL = "https://example.com";

    (generateUUID as jest.Mock).mockReturnValue("uuid-123");
    (prisma.paymentTokens.findUnique as jest.Mock).mockResolvedValue(null);
    (createToken as jest.Mock).mockResolvedValue("fake-jwt");
    (prisma.tokensJWT.create as jest.Mock).mockResolvedValue({
      id: "token-jwt-id",
    });
    (prisma.treatments.findFirst as jest.Mock).mockResolvedValue({
      stripeProductNumber: "price_123",
    });
    (stripe.prices.retrieve as jest.Mock).mockResolvedValue({
      id: "price_123",
      unit_amount: 10000,
    });
    (prisma.paymentTokens.create as jest.Mock).mockResolvedValue({
      id: "payment-token-id",
    });
    (dateFormater as jest.Mock).mockImplementation((d) => d);
    (fs.readFile as jest.Mock).mockResolvedValue("TEMPLATE CONTENT");
    (parseEmailConsultationRequest as jest.Mock).mockImplementation(
      ({ string }) => string
    );
    (sendMail as jest.Mock).mockResolvedValue(true);
  });

  afterAll(() => {
    process.env = OLD_ENV;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  });

  describe("Authentication", () => {
    test("Return 401 when x-api-key is invalid", async () => {
      const req = createRequest({
        body: {},
        headers: { "x-api-key": "wrong-key" },
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json).toBe("Access denied!");
    });

    test("Return 401 when x-api-key is missing", async () => {
      const req = createRequest({
        body: {},
        headers: {},
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json).toBe("Access denied!");
    });
  });

  describe("Field validation", () => {
    test("Return 422 when all required fields are missing", async () => {
      const body = {};

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(422);
      expect(json.ok).toBe(false);
      expect(json.message).toMatch(/Missing required fields:/);
      expect(json.message).toMatch(/name/);
      expect(json.message).toMatch(/email/);
      expect(json.message).toMatch(/phone/);
      expect(json.message).toMatch(/service/);
      expect(json.message).toMatch(/preferedDate/);
      expect(json.message).toMatch(/preferedTime/);
      expect(json.message).toMatch(/consent/);
    });

    test("Return 422 when required fields are empty strings", async () => {
      const body = {
        name: "   ",
        email: "",
        phone: "  ",
        service: "",
        preferedDate: "",
        preferedTime: "",
        consent: true,
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(422);
      expect(json.ok).toBe(false);
      expect(json.message).toMatch(/Missing required fields:/);
    });

    test("Return 422 when only some required fields are missing", async () => {
      const body = {
        name: "John Doe",
        email: "john@example.com",
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(422);
      expect(json.ok).toBe(false);

      expect(json.message).toMatch(/phone/);
      expect(json.message).toMatch(/service/);
      expect(json.message).toMatch(/preferedDate/);
      expect(json.message).toMatch(/preferedTime/);
      expect(json.message).toMatch(/consent/);
    });
  });

  describe("Consent validation", () => {
    test("Return 400 when consent is false", async () => {
      const body = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        service: "Botox",
        preferedDate: "2025-01-01",
        preferedTime: "10:00",
        consent: false,
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.ok).toBe(false);
      expect(json.message).toBe("Consent is required.");
    });

    test("Return 400 when consent is not boolean true", async () => {
      const body = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        service: "Botox",
        preferedDate: "2025-01-01",
        preferedTime: "10:00",
        consent: "yes",
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.ok).toBe(false);
    });
  });

  describe("Correct path", () => {
    test("Create token, paymentToken, send email and return 201", async () => {
      const body = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        service: "Botox",
        preferedDate: "2025-01-01",
        preferedTime: "10:00",
        consent: true,
        notes: "Some note",
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.ok).toBe(true);

      expect(prisma.paymentTokens.findUnique).toHaveBeenCalledWith({
        where: { jti: "uuid-123" },
      });

      expect(createToken).toHaveBeenCalledWith(
        expect.objectContaining({
          jti: "uuid-123",
          audience: "api/bookings",
          scope: "booking-request",
          unreservedClaims: expect.objectContaining({
            name: "John Doe",
            email: "john@example.com",
            phone: "123456789",
            service: "Botox",
            preferedDate: "2025-01-01",
            preferedTime: "10:00",
            consent: true,
          }),
        })
      );

      expect(prisma.treatments.findFirst).toHaveBeenCalledWith({
        where: { name: "Botox" },
        select: { stripeProductNumber: true },
      });

      expect(stripe.prices.retrieve).toHaveBeenCalledWith("price_123");

      expect(prisma.paymentTokens.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            jti: "uuid-123",
            email: "john@example.com",
            name: "John Doe",
            amountCents: 10000,
            currency: "AUD",
            provider: "Stripe",
            notes: "Some note",
          }),
        })
      );

      expect(sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          emailTo: "john@example.com",
          emailSubject: "Finish Your Booking | Aesthetics By Dr Hendler",
        })
      );
    });

    test("Create token even when notes is omitted (optional), converting it into null", async () => {
      const body = {
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "987654321",
        service: "Filler",
        preferedDate: "2025-02-15",
        preferedTime: "14:00",
        consent: true,
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.ok).toBe(true);

      expect(prisma.paymentTokens.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            notes: null,
          }),
        })
      );
    });
  });

  describe("JTI collision handling", () => {
    test("Create a new UUID when the first one already exists", async () => {
      (generateUUID as jest.Mock)
        .mockReturnValueOnce("uuid-collision")
        .mockReturnValueOnce("uuid-unique");

      (prisma.paymentTokens.findUnique as jest.Mock)
        .mockResolvedValueOnce({ jti: "uuid-collision" })
        .mockResolvedValueOnce(null);

      const body = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        service: "Botox",
        preferedDate: "2025-01-01",
        preferedTime: "10:00",
        consent: true,
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.ok).toBe(true);

      expect(prisma.paymentTokens.findUnique).toHaveBeenCalledTimes(2);
      expect(prisma.paymentTokens.findUnique).toHaveBeenNthCalledWith(1, {
        where: { jti: "uuid-collision" },
      });
      expect(prisma.paymentTokens.findUnique).toHaveBeenNthCalledWith(2, {
        where: { jti: "uuid-unique" },
      });

      expect(createToken).toHaveBeenCalledWith(
        expect.objectContaining({
          jti: "uuid-unique",
        })
      );
    });
  });

  describe("External services / Stripe errors", () => {
    test("Return 404 when treatment is not found in DB", async () => {
      (prisma.treatments.findFirst as jest.Mock).mockResolvedValueOnce(null);

      const body = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        service: "ServiceNotInDB",
        preferedDate: "2025-01-01",
        preferedTime: "10:00",
        consent: true,
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.ok).toBe(false);
    });

    test("Return 404 when treatment has no stripeProductNumber", async () => {
      (prisma.treatments.findFirst as jest.Mock).mockResolvedValueOnce({
        stripeProductNumber: null,
      });

      const body = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        service: "Botox",
        preferedDate: "2025-01-01",
        preferedTime: "10:00",
        consent: true,
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.ok).toBe(false);
    });

    test("Return 404 when Stripe does not return priceInfo", async () => {
      const { stripe } = require("@/lib/stripe");
      stripe.prices.retrieve.mockResolvedValueOnce(null);

      const body = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        service: "Botox",
        preferedDate: "2025-01-01",
        preferedTime: "10:00",
        consent: true,
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.ok).toBe(false);
    });

    test("Return 500 when Stripe throws an error", async () => {
      (stripe.prices.retrieve as jest.Mock).mockRejectedValueOnce(
        new Error("Stripe API error")
      );

      const body = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        service: "Botox",
        preferedDate: "2025-01-01",
        preferedTime: "10:00",
        consent: true,
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.ok).toBe(false);
    });
  });

  describe("Database errors", () => {
    test("Return 500 when prisma.tokensJWT.create fails", async () => {
      (prisma.tokensJWT.create as jest.Mock).mockRejectedValueOnce(
        new Error("DB error")
      );

      const body = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        service: "Botox",
        preferedDate: "2025-01-01",
        preferedTime: "10:00",
        consent: true,
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.ok).toBe(false);
    });

    test("Return 500 when prisma.paymentTokens.create fails", async () => {
      (prisma.paymentTokens.create as jest.Mock).mockRejectedValueOnce(
        new Error("DB error")
      );

      const body = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        service: "Botox",
        preferedDate: "2025-01-01",
        preferedTime: "10:00",
        consent: true,
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.ok).toBe(false);
    });
  });

  describe("Email sending / template reading errors", () => {
    test("Return 500 when sendMail fails", async () => {
      const { sendMail } = require("@/lib/mailer");
      sendMail.mockRejectedValueOnce(new Error("Email service down"));

      const body = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        service: "Botox",
        preferedDate: "2025-01-01",
        preferedTime: "10:00",
        consent: true,
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.ok).toBe(false);
    });

    test("Return 500 when fs.readFile fails", async () => {
      const fs = require("node:fs/promises");
      fs.readFile.mockRejectedValueOnce(new Error("File not found"));

      const body = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        service: "Botox",
        preferedDate: "2025-01-01",
        preferedTime: "10:00",
        consent: true,
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.ok).toBe(false);
    });
  });

  describe("Business logic / data processing", () => {
    test("Trim name, email and phone fields", async () => {
      const body = {
        name: "  John Doe  ",
        email: "  john@example.com  ",
        phone: "  123456789  ",
        service: "Botox",
        preferedDate: "2025-01-01",
        preferedTime: "10:00",
        consent: true,
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(201);

      const { createToken } = require("@/lib/jwt");
      expect(createToken).toHaveBeenCalledWith(
        expect.objectContaining({
          unreservedClaims: expect.objectContaining({
            name: "John Doe",
            email: "john@example.com",
            phone: "123456789",
          }),
        })
      );
    });

    test("Set expiresAt exactly 48 hours after createdAt", async () => {
      const body = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        service: "Botox",
        preferedDate: "2025-01-01",
        preferedTime: "10:00",
        consent: true,
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      const beforeCall = Date.now();
      await POST(req);
      const afterCall = Date.now();

      const createCall = (prisma.paymentTokens.create as jest.Mock).mock
        .calls[0][0];
      const createdAt = createCall.data.createdAt;
      const expiresAt = createCall.data.expiresAt;

      const diffMs = expiresAt.getTime() - createdAt.getTime();
      const diffHours = diffMs / (1000 * 3600);

      expect(diffHours).toBe(48);
      expect(createdAt.getTime()).toBeGreaterThanOrEqual(beforeCall);
      expect(createdAt.getTime()).toBeLessThanOrEqual(afterCall);
    });
  });

  describe("Email templates integration", () => {
    test("Call parseEmailConsultationRequest with proper data and checkout URL", async () => {
      const {
        parseEmailConsultationRequest,
      } = require("@/lib/utils/parseEmailConsultationRequest");
      const dateFormater = require("@/lib/utils/dateFormater").default;

      dateFormater.mockReturnValueOnce("01/01/2025");

      const body = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        service: "Botox",
        preferedDate: "2025-01-01",
        preferedTime: "10:00",
        consent: true,
        notes: "Test notes",
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      await POST(req);

      expect(parseEmailConsultationRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          string: "TEMPLATE CONTENT",
          data: expect.objectContaining({
            name: "John Doe",
            email: "john@example.com",
            phone: "123456789",
            service: "Botox",
            preferedDate: "01/01/2025",
            preferedTime: "10:00",
            notes: "Test notes",
          }),
          checkoutUrl: "https://example.com/bookings/checkout?id=token-jwt-id",
        })
      );

      expect(parseEmailConsultationRequest).toHaveBeenCalledTimes(2);
    });
  });

  describe("Currency, provider and amount", () => {
    test("Always use AUD as currency", async () => {
      const body = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        service: "Botox",
        preferedDate: "2025-01-01",
        preferedTime: "10:00",
        consent: true,
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      await POST(req);

      expect(prisma.paymentTokens.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            currency: "AUD",
          }),
        })
      );
    });

    test("Always use Stripe as provider", async () => {
      const body = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        service: "Botox",
        preferedDate: "2025-01-01",
        preferedTime: "10:00",
        consent: true,
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      await POST(req);

      expect(prisma.paymentTokens.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            provider: "Stripe",
          }),
        })
      );
    });

    test("Use unit_amount from Stripe as amountCents", async () => {
      const { stripe } = require("@/lib/stripe");
      stripe.prices.retrieve.mockResolvedValueOnce({
        id: "price_123",
        unit_amount: 25000, // $250.00 AUD
      });

      const body = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        service: "Botox",
        preferedDate: "2025-01-01",
        preferedTime: "10:00",
        consent: true,
      };

      const req = createRequest({
        body,
        headers: { "x-api-key": "test-api-key" },
      });

      await POST(req);

      expect(prisma.paymentTokens.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            amountCents: 25000,
          }),
        })
      );
    });
  });
});
