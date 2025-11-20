/**
 * @jest-environment node
 */

jest.mock("@/lib/prisma", () => ({
  prisma: {
    bookings: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        retrieve: jest.fn(),
      },
    },
    paymentIntents: {
      retrieve: jest.fn(),
      cancel: jest.fn(),
    },
    refunds: {
      list: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("node:fs/promises", () => ({
  readFile: jest.fn(),
}));

jest.mock("node:path", () => ({
  join: jest.fn(),
}));

jest.mock("@/lib/utils/parseEmailConsultationRequest", () => ({
  parseEmailConsultationRequest: jest.fn(),
}));

jest.mock("@/lib/mailer", () => ({
  sendMail: jest.fn(),
}));

jest.mock("@/lib/business/booking/cancellation", () => ({
  checkIsRefundable: jest.fn(),
}));

jest.mock("@/lib/utils/dateFormater", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { GET, DELETE } from "@/app/api/v1/bookings/[bookingId]/route";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseEmailConsultationRequest } from "@/lib/utils/parseEmailConsultationRequest";
import { sendMail } from "@/lib/mailer";
import { checkIsRefundable } from "@/lib/business/booking/cancellation";
import dateFormater from "@/lib/utils/dateFormater";

const makeRequest = (
  url: string,
  { method = "GET", headers = {}, body }: any = {}
) =>
  new Request(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

describe("GET /api/v1/bookings/[bookingId] and DELETE /api/v1/bookings/[bookingId]", () => {
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

  describe("GET /api/v1/bookings/[bookingId]", () => {
    test("Return 401 if x-api-key is invalid", async () => {
      const req = makeRequest("https://example.com/api/v1/bookings/booking-1", {
        method: "GET",
        headers: { "x-api-key": "wrong-key" },
      });

      const res = await GET(req, { params: { bookingId: "booking-1" } });
      const body = await res.json();

      expect(res.status).toBe(401);
      expect(body).toEqual({ ok: false, message: "Access denied!" });
    });

    test("Return 401 if x-api-key is not provided", async () => {
      const req = makeRequest("https://example.com/api/v1/bookings/booking-1", {
        method: "GET",
      });

      const res = await GET(req, { params: { bookingId: "booking-1" } });
      const body = await res.json();

      expect(res.status).toBe(401);
      expect(body).toEqual({ ok: false, message: "Access denied!" });
    });

    test("Return 400 if bookingId is not provided in params", async () => {
      const req = makeRequest("https://example.com/api/v1/bookings/", {
        method: "GET",
        headers: { "x-api-key": process.env.API_KEY },
      });

      const res = await GET(req, { params: {} as any });
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body).toEqual({
        message: "Booking ID is required",
      });
    });

    test("Return 200 with booking data when booking is found", async () => {
      const booking = {
        id: "booking-1",
        status: "CONFIRMED",
        name: "John Doe",
        date: new Date("2025-01-01T12:00:00Z"),
        time: "12:00",
        service: "Service X",
        token: {
          id: "token-1",
          amountCents: 12345,
        },
      };

      (prisma.bookings.findUnique as jest.Mock).mockResolvedValue(booking);
      (dateFormater as jest.Mock).mockReturnValue("01/01/2025");

      const req = makeRequest("https://example.com/api/v1/bookings/booking-1", {
        method: "GET",
        headers: { "x-api-key": process.env.API_KEY },
      });

      const res = await GET(req, { params: { bookingId: "booking-1" } });
      const body = await res.json();

      expect(prisma.bookings.findUnique).toHaveBeenCalledWith({
        where: { id: "booking-1" },
        include: { token: true },
      });

      expect(dateFormater).toHaveBeenCalledWith(booking.date);

      expect(res.status).toBe(200);
      expect(body).toEqual({
        ok: true,
        status: booking.status,
        amount: booking.token.amountCents,
        name: booking.name,
        providerRef: booking.token.id,
        date: "01/01/2025",
        time: booking.time,
        service: booking.service,
      });
    });

    test("Return 500 if any error occurs while getting booking", async () => {
      (prisma.bookings.findUnique as jest.Mock).mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      const req = makeRequest("https://example.com/api/v1/bookings/booking-1", {
        method: "GET",
        headers: { "x-api-key": process.env.API_KEY },
      });

      const res = await GET(req, { params: { bookingId: "booking-1" } });
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body).toEqual({
        err: {},
        message: "Internal server error",
      });
    });
  });

  describe("DELETE /api/v1/bookings/[bookingId]", () => {
    test("Return 401 if x-api-key is invalid", async () => {
      const req = makeRequest("https://example.com/api/v1/bookings/booking-1", {
        method: "DELETE",
        headers: { "x-api-key": "wrong-key" },
      });

      const res = await DELETE(req, { params: { bookingId: "booking-1" } });
      const body = await res.json();

      expect(res.status).toBe(401);
      expect(body).toEqual({ ok: false, message: "Access denied!" });
    });

    test("Return 401 if x-api-key is not provided", async () => {
      const req = makeRequest("https://example.com/api/v1/bookings/booking-1", {
        method: "DELETE",
      });

      const res = await DELETE(req, { params: { bookingId: "booking-1" } });
      const body = await res.json();

      expect(res.status).toBe(401);
      expect(body).toEqual({ ok: false, message: "Access denied!" });
    });

    test("Return 404 if booking is not found", async () => {
      (prisma.bookings.findUnique as jest.Mock).mockResolvedValue(null);

      const req = makeRequest("https://example.com/api/v1/bookings/booking-1", {
        method: "DELETE",
        headers: { "x-api-key": process.env.API_KEY },
      });

      const res = await DELETE(req, { params: { bookingId: "booking-1" } });
      const body = await res.json();

      expect(prisma.bookings.findUnique).toHaveBeenCalledWith({
        where: { id: "booking-1" },
        include: { token: true },
      });

      expect(res.status).toBe(404);
      expect(body).toEqual({
        message: "Booking information not found!",
      });
    });

    test("Return 209 if booking has already been cancelled", async () => {
      const booking = {
        id: "booking-1",
        status: "CANCELLED",
        date: new Date("2025-01-01T12:00:00Z"),
        time: "12:00",
        token: null,
      };

      (prisma.bookings.findUnique as jest.Mock).mockResolvedValue(booking);

      const req = makeRequest("https://example.com/api/v1/bookings/booking-1", {
        method: "DELETE",
        headers: { "x-api-key": process.env.API_KEY },
      });

      const res = await DELETE(req, { params: { bookingId: "booking-1" } });
      const body = await res.json();

      expect(res.status).toBe(209);
      expect(body).toEqual({
        message: "Booking has already been cancelled!",
      });
    });

    test("Return 404 if booking is refundable but payment session is not found", async () => {
      const booking = {
        id: "booking-1",
        status: "CONFIRMED",
        date: new Date("2025-01-01T12:00:00Z"),
        time: "12:00",
        token: null,
      };

      (prisma.bookings.findUnique as jest.Mock).mockResolvedValue(booking);
      (checkIsRefundable as jest.Mock).mockReturnValue(true);

      const req = makeRequest("https://example.com/api/v1/bookings/booking-1", {
        method: "DELETE",
        headers: { "x-api-key": process.env.API_KEY },
      });

      const res = await DELETE(req, { params: { bookingId: "booking-1" } });
      const body = await res.json();

      expect(checkIsRefundable).toHaveBeenCalledWith({
        bookingDate: booking.date,
        bookingTime: booking.time,
      });
      expect(res.status).toBe(404);
      expect(body).toEqual({
        message: "Payment session not found!",
      });
    });

    test("Return 404 if payment intent is not found", async () => {
      const booking = {
        id: "booking-1",
        status: "CONFIRMED",
        date: new Date("2025-01-01T12:00:00Z"),
        time: "12:00",
        token: {
          providerRef: "session-1",
        },
      };

      (prisma.bookings.findUnique as jest.Mock).mockResolvedValue(booking);
      (checkIsRefundable as jest.Mock).mockReturnValue(true);

      (stripe.checkout.sessions.retrieve as jest.Mock).mockResolvedValue({
        id: "session-1",
        payment_intent: "pi_123",
      });

      (stripe.paymentIntents.retrieve as jest.Mock).mockResolvedValue(null);

      const req = makeRequest("https://example.com/api/v1/bookings/booking-1", {
        method: "DELETE",
        headers: { "x-api-key": process.env.API_KEY },
      });

      const res = await DELETE(req, { params: { bookingId: "booking-1" } });
      const body = await res.json();

      expect(res.status).toBe(404);
      expect(body).toEqual({
        message: "Payment intent not found!",
      });
    });

    test("Refund payment when payment intent succeeded and no refund exists", async () => {
      const booking = {
        id: "booking-1",
        status: "CONFIRMED",
        date: new Date("2025-01-01T12:00:00Z"),
        time: "12:00",
        email: "user@example.com",
        token: {
          providerRef: "session-1",
        },
      };

      (prisma.bookings.findUnique as jest.Mock).mockResolvedValue(booking);
      (checkIsRefundable as jest.Mock).mockReturnValue(true);

      (stripe.checkout.sessions.retrieve as jest.Mock).mockResolvedValue({
        id: "session-1",
        payment_intent: "pi_123",
      });

      (stripe.paymentIntents.retrieve as jest.Mock).mockResolvedValue({
        id: "pi_123",
        status: "succeeded",
      });

      (stripe.refunds.list as jest.Mock).mockResolvedValue(null);
      (stripe.refunds.create as jest.Mock).mockResolvedValue({
        id: "re_123",
        status: "succeeded",
      });

      (prisma.bookings.update as jest.Mock).mockResolvedValue({
        ...booking,
        status: "CANCELLED",
        date: booking.date,
      });

      (dateFormater as jest.Mock).mockImplementation((d: Date) => {
        // se for booking.date → formato legível; se for new Date() para cancelledAt, tanto faz
        if (d instanceof Date) {
          return "01/01/2025";
        }
        return "formatted-date";
      });

      (path.join as jest.Mock)
        .mockReturnValueOnce("/mock/path/index.html")
        .mockReturnValueOnce("/mock/path/index.txt");

      (readFile as jest.Mock)
        .mockResolvedValueOnce("<html>TEMPLATE HTML</html>")
        .mockResolvedValueOnce("TEMPLATE TXT");

      (parseEmailConsultationRequest as jest.Mock)
        .mockReturnValueOnce("<html>HTML PARSED</html>")
        .mockReturnValueOnce("TXT PARSED");

      (sendMail as jest.Mock).mockResolvedValue(true);

      const req = makeRequest("https://example.com/api/v1/bookings/booking-1", {
        method: "DELETE",
        headers: { "x-api-key": process.env.API_KEY },
      });

      const res = await DELETE(req, { params: { bookingId: "booking-1" } });
      const body = await res.json();

      expect(stripe.refunds.create).toHaveBeenCalledWith({
        payment_intent: "pi_123",
      });

      expect(prisma.bookings.update).toHaveBeenCalledWith({
        where: { id: "booking-1" },
        data: {
          cancelledAt: expect.any(String),
          status: "CANCELLED",
        },
      });

      expect(sendMail).toHaveBeenCalledWith({
        emailTo: booking.email,
        emailSubject: "Booking Cancelled | Aesthetics By Dr Hendler",
        emailText: "TXT PARSED",
        emailHtml: "<html>HTML PARSED</html>",
      });

      expect(res.status).toBe(200);
      expect(body).toEqual({
        ok: true,
        status: "CANCELLED",
      });
    });

    test("Cancel payment (no refund) when payment intent is not succeeded and no refund exists", async () => {
      const booking = {
        id: "booking-1",
        status: "CONFIRMED",
        date: new Date("2025-01-01T12:00:00Z"),
        time: "12:00",
        email: "user@example.com",
        token: {
          providerRef: "session-1",
        },
      };

      (prisma.bookings.findUnique as jest.Mock).mockResolvedValue(booking);
      (checkIsRefundable as jest.Mock).mockReturnValue(true);

      (stripe.checkout.sessions.retrieve as jest.Mock).mockResolvedValue({
        id: "session-1",
        payment_intent: "pi_123",
      });

      (stripe.paymentIntents.retrieve as jest.Mock).mockResolvedValue({
        id: "pi_123",
        status: "requires_payment_method",
      });

      (stripe.refunds.list as jest.Mock).mockResolvedValue(null);
      (stripe.paymentIntents.cancel as jest.Mock).mockResolvedValue({
        id: "pi_123",
        status: "canceled",
      });

      (prisma.bookings.update as jest.Mock).mockResolvedValue({
        ...booking,
        status: "CANCELLED",
        date: booking.date,
      });

      (dateFormater as jest.Mock).mockReturnValue("01/01/2025");

      (path.join as jest.Mock)
        .mockReturnValueOnce("/mock/path/index.html")
        .mockReturnValueOnce("/mock/path/index.txt");

      (readFile as jest.Mock)
        .mockResolvedValueOnce("<html>TEMPLATE HTML</html>")
        .mockResolvedValueOnce("TEMPLATE TXT");

      (parseEmailConsultationRequest as jest.Mock)
        .mockReturnValueOnce("<html>HTML PARSED</html>")
        .mockReturnValueOnce("TXT PARSED");

      (sendMail as jest.Mock).mockResolvedValue(true);

      const req = makeRequest("https://example.com/api/v1/bookings/booking-1", {
        method: "DELETE",
        headers: { "x-api-key": process.env.API_KEY },
      });

      const res = await DELETE(req, { params: { bookingId: "booking-1" } });
      const body = await res.json();

      expect(stripe.paymentIntents.cancel).toHaveBeenCalledWith("pi_123");

      expect(res.status).toBe(200);
      expect(body).toEqual({
        ok: true,
        status: "CANCELLED",
      });
    });

    test("Skip Stripe refund/cancel if booking is not refundable", async () => {
      const booking = {
        id: "booking-1",
        status: "CONFIRMED",
        date: new Date("2025-01-01T12:00:00Z"),
        time: "12:00",
        email: "user@example.com",
        token: {
          providerRef: "session-1",
        },
      };

      (prisma.bookings.findUnique as jest.Mock).mockResolvedValue(booking);
      (checkIsRefundable as jest.Mock).mockReturnValue(false);

      (prisma.bookings.update as jest.Mock).mockResolvedValue({
        ...booking,
        status: "CANCELLED",
        date: booking.date,
      });

      (dateFormater as jest.Mock).mockReturnValue("01/01/2025");

      (path.join as jest.Mock)
        .mockReturnValueOnce("/mock/path/index.html")
        .mockReturnValueOnce("/mock/path/index.txt");

      (readFile as jest.Mock)
        .mockResolvedValueOnce("<html>TEMPLATE HTML</html>")
        .mockResolvedValueOnce("TEMPLATE TXT");

      (parseEmailConsultationRequest as jest.Mock)
        .mockReturnValueOnce("<html>HTML PARSED</html>")
        .mockReturnValueOnce("TXT PARSED");

      (sendMail as jest.Mock).mockResolvedValue(true);

      const req = makeRequest("https://example.com/api/v1/bookings/booking-1", {
        method: "DELETE",
        headers: { "x-api-key": process.env.API_KEY },
      });

      const res = await DELETE(req, { params: { bookingId: "booking-1" } });
      const body = await res.json();

      expect(checkIsRefundable).toHaveBeenCalled();
      expect(stripe.checkout.sessions.retrieve).not.toHaveBeenCalled();
      expect(stripe.paymentIntents.retrieve).not.toHaveBeenCalled();
      expect(stripe.refunds.create).not.toHaveBeenCalled();
      expect(stripe.paymentIntents.cancel).not.toHaveBeenCalled();

      expect(res.status).toBe(200);
      expect(body).toEqual({
        ok: true,
        status: "CANCELLED",
      });
    });

    test("Return 500 if any unexpected error occurs during cancellation", async () => {
      (prisma.bookings.findUnique as jest.Mock).mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      const req = makeRequest("https://example.com/api/v1/bookings/booking-1", {
        method: "DELETE",
        headers: { "x-api-key": process.env.API_KEY },
      });

      const res = await DELETE(req, { params: { bookingId: "booking-1" } });
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body).toEqual({
        message: "Internal server error",
      });
    });
  });
});
