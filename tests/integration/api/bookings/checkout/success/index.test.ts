jest.mock("@/lib/prisma", () => ({
  prisma: {
    paymentTokens: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    bookings: {
      findUnique: jest.fn(),
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

jest.mock("@/lib/utils/dateFormater", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { POST } from "@/app/api/v1/bookings/checkout/success/route";
import { prisma } from "@/lib/prisma";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseEmailConsultationRequest } from "@/lib/utils/parseEmailConsultationRequest";
import { sendMail } from "@/lib/mailer";
import dateFormater from "@/lib/utils/dateFormater";

const makeRequest = (
  url: string,
  { headers = {}, body }: { headers?: any; body?: any } = {}
) =>
  new Request(url, {
    method: "POST",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

describe("POST /api/v1/bookings/checkout/success", () => {
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

  describe("Authentication and basic validation", () => {
    test("Return 401 if x-api-key is invalid", async () => {
      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout/success?session_id=session-123",
        {
          headers: {
            "x-api-key": "wrong-key",
          },
        }
      );

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(401);
      expect(body).toBe("Access denied!");
    });

    test("Return 401 if x-api-key is not provided", async () => {
      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout/success?session_id=session-123",
        {}
      );

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(401);
      expect(body).toBe("Access denied!");
    });

    test("Return 400 if session_id is not provided", async () => {
      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout/success",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body).toEqual({
        error: "Please provide a valid session_id",
      });
    });
  });

  describe("PaymentToken handling", () => {
    test("Return 404 if paymentToken is not found", async () => {
      (prisma.paymentTokens.findUnique as jest.Mock).mockResolvedValue(null);

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout/success?session_id=session-123",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await POST(req);
      const body = await res.json();

      expect(prisma.paymentTokens.findUnique).toHaveBeenCalledWith({
        where: { providerRef: "session-123" },
      });
      expect(res.status).toBe(404);
      expect(body).toEqual({
        error: "Booking request not found!",
      });
    });

    test("Do not update paymentToken if already used (usedAt is set)", async () => {
      const paymentToken = {
        id: "token-1",
        providerRef: "session-123",
        usedAt: new Date(),
        status: "CONFIRMED",
        email: "user@example.com",
        name: "John Doe",
        phone: "123456789",
        service: "Service X",
        date: new Date("2025-01-01T12:00:00Z"),
        time: "12:00",
        notes: "Some notes",
        consent: true,
      };

      (prisma.paymentTokens.findUnique as jest.Mock).mockResolvedValue(
        paymentToken
      );
      (prisma.bookings.findUnique as jest.Mock).mockResolvedValue({
        id: "booking-1",
      });

      (readFile as jest.Mock).mockResolvedValue("TEMPLATE");
      (parseEmailConsultationRequest as jest.Mock).mockReturnValue("PARSED");
      (sendMail as jest.Mock).mockResolvedValue(true);
      (dateFormater as jest.Mock).mockReturnValue("01/01/2025");

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout/success?session_id=session-123",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await POST(req);
      const body = await res.json();

      expect(prisma.paymentTokens.update).not.toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(body).toEqual({
        redirectUrl: "https://example.com/bookings/booking-1",
      });
    });

    test("Update paymentToken if not used yet (usedAt is null)", async () => {
      const initialPaymentToken = {
        id: "token-1",
        providerRef: "session-123",
        usedAt: null,
        status: "PENDING",
        email: "user@example.com",
        name: "John Doe",
        phone: "123456789",
        service: "Service X",
        date: new Date("2025-01-01T12:00:00Z"),
        time: "12:00",
        notes: "Some notes",
        consent: true,
      };

      const updatedPaymentToken = {
        ...initialPaymentToken,
        usedAt: new Date(),
        status: "CONFIRMED",
      };

      (prisma.paymentTokens.findUnique as jest.Mock).mockResolvedValue(
        initialPaymentToken
      );
      (prisma.paymentTokens.update as jest.Mock).mockResolvedValue(
        updatedPaymentToken
      );
      (prisma.bookings.findUnique as jest.Mock).mockResolvedValue({
        id: "booking-1",
      });

      (readFile as jest.Mock).mockResolvedValue("TEMPLATE");
      (parseEmailConsultationRequest as jest.Mock).mockReturnValue("PARSED");
      (sendMail as jest.Mock).mockResolvedValue(true);
      (dateFormater as jest.Mock).mockReturnValue("01/01/2025");

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout/success?session_id=session-123",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await POST(req);
      const body = await res.json();

      expect(prisma.paymentTokens.update).toHaveBeenCalledWith({
        where: { providerRef: "session-123" },
        data: {
          usedAt: expect.any(Date),
          status: "CONFIRMED",
        },
      });
      expect(res.status).toBe(200);
      expect(body).toEqual({
        redirectUrl: "https://example.com/bookings/booking-1",
      });
    });
  });

  describe("Booking creation and retrieval", () => {
    test("Use existing booking if found", async () => {
      const paymentToken = {
        id: "token-1",
        providerRef: "session-123",
        usedAt: new Date(),
        status: "CONFIRMED",
        email: "user@example.com",
        name: "John Doe",
        phone: "123456789",
        service: "Service X",
        date: new Date("2025-01-01T12:00:00Z"),
        time: "12:00",
        notes: "Some notes",
        consent: true,
      };

      (prisma.paymentTokens.findUnique as jest.Mock).mockResolvedValue(
        paymentToken
      );
      (prisma.bookings.findUnique as jest.Mock).mockResolvedValue({
        id: "existing-booking-1",
      });
      (readFile as jest.Mock).mockResolvedValue("TEMPLATE");
      (parseEmailConsultationRequest as jest.Mock).mockReturnValue("PARSED");
      (sendMail as jest.Mock).mockResolvedValue(true);
      (dateFormater as jest.Mock).mockReturnValue("01/01/2025");

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout/success?session_id=session-123",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await POST(req);
      const body = await res.json();

      expect(prisma.bookings.findUnique).toHaveBeenCalledWith({
        where: { tokenId: paymentToken.id },
      });
      expect(prisma.bookings.create).not.toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(body).toEqual({
        redirectUrl: "https://example.com/bookings/existing-booking-1",
      });
    });

    test("Create booking if not found", async () => {
      const paymentToken = {
        id: "token-1",
        providerRef: "session-123",
        usedAt: new Date(),
        status: "CONFIRMED",
        email: "user@example.com",
        name: "John Doe",
        phone: "123456789",
        service: "Service X",
        date: new Date("2025-01-01T12:00:00Z"),
        time: "12:00",
        notes: "Some notes",
        consent: true,
      };

      (prisma.paymentTokens.findUnique as jest.Mock).mockResolvedValue(
        paymentToken
      );
      (prisma.bookings.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.bookings.create as jest.Mock).mockResolvedValue({
        id: "new-booking-1",
      });

      (readFile as jest.Mock).mockResolvedValue("TEMPLATE");
      (parseEmailConsultationRequest as jest.Mock).mockReturnValue("PARSED");
      (sendMail as jest.Mock).mockResolvedValue(true);
      (dateFormater as jest.Mock).mockReturnValue("01/01/2025");

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout/success?session_id=session-123",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await POST(req);
      const body = await res.json();

      expect(prisma.bookings.create).toHaveBeenCalledWith({
        data: {
          email: paymentToken.email,
          name: paymentToken.name,
          phone: paymentToken.phone,
          service: paymentToken.service,
          date: paymentToken.date,
          time: paymentToken.time,
          notes: paymentToken.notes,
          consent: paymentToken.consent,
          confirmedAt: expect.any(Date),
          tokenId: paymentToken.id,
        },
      });
      expect(res.status).toBe(200);
      expect(body).toEqual({
        redirectUrl: "https://example.com/bookings/new-booking-1",
      });
    });
  });

  describe("Email template and sending", () => {
    test("Reads HTML and TXT templates and calls parseEmailConsultationRequest correctly", async () => {
      const paymentToken = {
        id: "token-1",
        providerRef: "session-123",
        usedAt: new Date(),
        status: "CONFIRMED",
        email: "user@example.com",
        name: "John Doe",
        phone: "123456789",
        service: "Service X",
        date: new Date("2025-01-01T12:00:00Z"),
        time: "12:00",
        notes: "Some notes",
        consent: true,
      };

      (prisma.paymentTokens.findUnique as jest.Mock).mockResolvedValue(
        paymentToken
      );
      (prisma.bookings.findUnique as jest.Mock).mockResolvedValue({
        id: "booking-1",
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
      (dateFormater as jest.Mock).mockReturnValue("01/01/2025");

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout/success?session_id=session-123",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await POST(req);
      const body = await res.json();

      expect(path.join).toHaveBeenNthCalledWith(
        1,
        process.cwd(),
        "lib/templates/bookingConfirmation/index.html"
      );
      expect(path.join).toHaveBeenNthCalledWith(
        2,
        process.cwd(),
        "lib/templates/bookingConfirmation/index.txt"
      );

      expect(readFile).toHaveBeenNthCalledWith(
        1,
        "/mock/path/index.html",
        "utf-8"
      );
      expect(readFile).toHaveBeenNthCalledWith(
        2,
        "/mock/path/index.txt",
        "utf-8"
      );

      const expectedFormatted = {
        ...paymentToken,
        date: "01/01/2025",
      };

      expect(parseEmailConsultationRequest).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          string: "<html>TEMPLATE HTML</html>",
          data: expectedFormatted,
          bookingUrl: "https://example.com/bookings/booking-1",
        })
      );

      expect(parseEmailConsultationRequest).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          string: "TEMPLATE TXT",
          data: expectedFormatted,
          bookingUrl: "https://example.com/bookings/booking-1",
        })
      );

      expect(sendMail).toHaveBeenCalledWith({
        emailTo: paymentToken.email,
        emailSubject: "Booking Confirmed | Aesthetics By Dr Hendler",
        emailText: "TXT PARSED",
        emailHtml: "<html>HTML PARSED</html>",
      });

      expect(res.status).toBe(200);
      expect(body).toEqual({
        redirectUrl: "https://example.com/bookings/booking-1",
      });
    });
  });

  describe("Error handling", () => {
    test("Return 404 if any error is thrown in the flow", async () => {
      (prisma.paymentTokens.findUnique as jest.Mock).mockImplementation(() => {
        throw new Error("Unexpected DB error");
      });

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout/success?session_id=session-123",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(404);
      expect(body).toEqual({
        error: "Session invalid or inexistent",
      });
    });

    test("Return 404 if reading templates fails", async () => {
      const paymentToken = {
        id: "token-1",
        providerRef: "session-123",
        usedAt: new Date(),
        status: "CONFIRMED",
        email: "user@example.com",
        name: "John Doe",
        phone: "123456789",
        service: "Service X",
        date: new Date("2025-01-01T12:00:00Z"),
        time: "12:00",
        notes: "Some notes",
        consent: true,
      };

      (prisma.paymentTokens.findUnique as jest.Mock).mockResolvedValue(
        paymentToken
      );
      (prisma.bookings.findUnique as jest.Mock).mockResolvedValue({
        id: "booking-1",
      });

      (path.join as jest.Mock)
        .mockReturnValueOnce("/mock/path/index.html")
        .mockReturnValueOnce("/mock/path/index.txt");

      (readFile as jest.Mock).mockRejectedValue(new Error("FS error"));
      (dateFormater as jest.Mock).mockReturnValue("01/01/2025");

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout/success?session_id=session-123",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(404);
      expect(body).toEqual({
        error: "Session invalid or inexistent",
      });
    });

    test("Return 404 if sendMail fails", async () => {
      const paymentToken = {
        id: "token-1",
        providerRef: "session-123",
        usedAt: new Date(),
        status: "CONFIRMED",
        email: "user@example.com",
        name: "John Doe",
        phone: "123456789",
        service: "Service X",
        date: new Date("2025-01-01T12:00:00Z"),
        time: "12:00",
        notes: "Some notes",
        consent: true,
      };

      (prisma.paymentTokens.findUnique as jest.Mock).mockResolvedValue(
        paymentToken
      );
      (prisma.bookings.findUnique as jest.Mock).mockResolvedValue({
        id: "booking-1",
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

      (sendMail as jest.Mock).mockRejectedValue(new Error("Mailer error"));
      (dateFormater as jest.Mock).mockReturnValue("01/01/2025");

      const req = makeRequest(
        "https://example.com/api/v1/bookings/checkout/success?session_id=session-123",
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        }
      );

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(404);
      expect(body).toEqual({
        error: "Session invalid or inexistent",
      });
    });
  });
});
