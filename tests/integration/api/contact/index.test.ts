import { NextRequest } from "next/server";
import { POST } from "@/app/api/v1/contact/route";
import { sendContactMessage } from "@/lib/mailer";

jest.mock("@/lib/mailer", () => ({
  sendContactMessage: jest.fn(),
}));

describe("POST /api/v1/contact", () => {
  const validApiKey = process.env.API_KEY;

  const validContactData = {
    name: "Evangelista Teixeira",
    phone: "+61 0412 345 678",
    email: "evangelista.teixeira@example.com",
    message: "I would like to schedule an appointment!",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (sendContactMessage as jest.Mock).mockResolvedValue({ success: true });
  });

  describe("Authentication", () => {
    test("Request with no API key: Must return 401", async () => {
      const req = new NextRequest("http://localhost:3000/api/v1/contact", {
        method: "POST",
        body: JSON.stringify(validContactData),
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(401);
      expect(body).toBe("Access denied!");
    });

    test("Request with wrong API key: Must return 401", async () => {
      const req = new NextRequest("http://localhost:3000/api/v1/contact", {
        method: "POST",
        headers: { "x-api-key": "invalid-key" },
        body: JSON.stringify(validContactData),
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(401);
      expect(body).toBe("Access denied!");
    });
  });

  describe("Validation - Missing Fields", () => {
    test("Should return 422 when name is missing", async () => {
      const invalidData = { ...validContactData };
      delete invalidData.name;

      const req = new NextRequest("http://localhost:3000/api/v1/contact", {
        method: "POST",
        headers: { "x-api-key": validApiKey },
        body: JSON.stringify(invalidData),
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(422);
      expect(body.ok).toBe(false);
      expect(body.message).toContain("Missing required fields");
      expect(body.message).toContain("name");
    });

    test("Should return 422 when phone is missing", async () => {
      const invalidData = { ...validContactData };
      delete invalidData.phone;

      const req = new NextRequest("http://localhost:3000/api/v1/contact", {
        method: "POST",
        headers: { "x-api-key": validApiKey },
        body: JSON.stringify(invalidData),
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(422);
      expect(body.ok).toBe(false);
      expect(body.message).toContain("phone");
    });

    test("Should return 422 when email is missing", async () => {
      const invalidData = { ...validContactData };
      delete invalidData.email;

      const req = new NextRequest("http://localhost:3000/api/v1/contact", {
        method: "POST",
        headers: { "x-api-key": validApiKey },
        body: JSON.stringify(invalidData),
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(422);
      expect(body.ok).toBe(false);
      expect(body.message).toContain("email");
    });

    test("Should return 422 when message is missing", async () => {
      const invalidData = { ...validContactData };
      delete invalidData.message;

      const req = new NextRequest("http://localhost:3000/api/v1/contact", {
        method: "POST",
        headers: { "x-api-key": validApiKey },
        body: JSON.stringify(invalidData),
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(422);
      expect(body.ok).toBe(false);
      expect(body.message).toContain("message");
    });

    test("Should return 422 when multiple fields are missing", async () => {
      const invalidData = {
        name: "João Silva",
      };

      const req = new NextRequest("http://localhost:3000/api/v1/contact", {
        method: "POST",
        headers: { "x-api-key": validApiKey },
        body: JSON.stringify(invalidData),
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(422);
      expect(body.ok).toBe(false);
      expect(body.message).toContain("phone");
      expect(body.message).toContain("email");
      expect(body.message).toContain("message");
    });

    test("Should return 422 when field is empty string", async () => {
      const invalidData = {
        ...validContactData,
        name: "   ",
      };

      const req = new NextRequest("http://localhost:3000/api/v1/contact", {
        method: "POST",
        headers: { "x-api-key": validApiKey },
        body: JSON.stringify(invalidData),
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(422);
      expect(body.ok).toBe(false);
    });
  });

  describe("Validation - Invalid Format", () => {
    test("Should return 422 when name format is invalid", async () => {
      const invalidData = {
        ...validContactData,
        name: "J",
      };

      const req = new NextRequest("http://localhost:3000/api/v1/contact", {
        method: "POST",
        headers: { "x-api-key": validApiKey },
        body: JSON.stringify(invalidData),
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(422);
      expect(body.ok).toBe(false);
      expect(body.message).toContain("not valid");
      expect(body.message).toContain("name");
    });

    test("Should return 422 when email format is invalid", async () => {
      const invalidData = {
        ...validContactData,
        email: "email-invalido",
      };

      const req = new NextRequest("http://localhost:3000/api/v1/contact", {
        method: "POST",
        headers: { "x-api-key": validApiKey },
        body: JSON.stringify(invalidData),
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(422);
      expect(body.ok).toBe(false);
      expect(body.message).toContain("not valid");
      expect(body.message).toContain("email");
    });

    test("Should return 422 when phone format is invalid", async () => {
      const invalidData = {
        ...validContactData,
        phone: "123",
      };

      const req = new NextRequest("http://localhost:3000/api/v1/contact", {
        method: "POST",
        headers: { "x-api-key": validApiKey },
        body: JSON.stringify(invalidData),
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(422);
      expect(body.ok).toBe(false);
      expect(body.message).toContain("not valid");
      expect(body.message).toContain("phone");
    });

    test("Should return 422 when multiple fields have invalid format", async () => {
      const invalidData = {
        name: "J",
        phone: "123",
        email: "invalid-email",
        message: "Mensagem válida",
      };

      const req = new NextRequest("http://localhost:3000/api/v1/contact", {
        method: "POST",
        headers: { "x-api-key": validApiKey },
        body: JSON.stringify(invalidData),
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(422);
      expect(body.ok).toBe(false);
      expect(body.message).toContain("not valid");
    });
  });

  describe("Successful Contact Submission", () => {
    test("Should return 200 and send email with valid data", async () => {
      const req = new NextRequest("http://localhost:3000/api/v1/contact", {
        method: "POST",
        headers: { "x-api-key": validApiKey },
        body: JSON.stringify(validContactData),
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.ok).toBe(true);

      expect(sendContactMessage).toHaveBeenCalledTimes(1);
      expect(sendContactMessage).toHaveBeenCalledWith({
        contactName: validContactData.name,
        contactEmail: validContactData.email,
        contactPhone: validContactData.phone,
        contactMessage: validContactData.message,
      });
    });

    test("Should accept different valid phone formats", async () => {
      const phoneFormats = [
        "+61 401 234 567",
        "+61 412 345 678",
        "+61 423 456 789",
        "+61 434 567 890",
        "+61 445 678 901",
        "+61401234567",
        "+61412345678",
        "+61423456789",
        "0401 234 567",
        "0412 345 678",
        "0423 456 789",
        "0401234567",
        "0412345678",
        "0423456789",
      ];

      for (const phone of phoneFormats) {
        const data = { ...validContactData, phone };

        const req = new NextRequest("http://localhost:3000/api/v1/contact", {
          method: "POST",
          headers: { "x-api-key": validApiKey },
          body: JSON.stringify(data),
        });

        const res = await POST(req);
        const body = await res.json();

        expect(res.ok).toBe(true);
      }
    });

    test("Should accept different valid email formats", async () => {
      const emails = [
        "test@example.com",
        "user.name@example.com",
        "user+tag@example.co.uk",
      ];

      for (const email of emails) {
        const data = { ...validContactData, email };

        const req = new NextRequest("http://localhost:3000/api/v1/contact", {
          method: "POST",
          headers: { "x-api-key": validApiKey },
          body: JSON.stringify(data),
        });

        const res = await POST(req);
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.ok).toBe(true);
      }
    });
  });

  describe("Error Handling", () => {
    test("Should return 500 when email service fails", async () => {
      (sendContactMessage as jest.Mock).mockRejectedValueOnce(
        new Error("Email service error")
      );

      const req = new NextRequest("http://localhost:3000/api/v1/contact", {
        method: "POST",
        headers: { "x-api-key": validApiKey },
        body: JSON.stringify(validContactData),
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body.ok).toBe(false);
      expect(body.message).toBe("Something went wrong on the server!");
    });

    test("Should return 500 when JSON parsing fails", async () => {
      const req = new NextRequest("http://localhost:3000/api/v1/contact", {
        method: "POST",
        headers: {
          "x-api-key": validApiKey,
          "content-type": "application/json",
        },
        body: "invalid json{",
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body.ok).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    test("Should handle very long message", async () => {
      const longMessage = "A".repeat(5000);
      const data = { ...validContactData, message: longMessage };

      const req = new NextRequest("http://localhost:3000/api/v1/contact", {
        method: "POST",
        headers: { "x-api-key": validApiKey },
        body: JSON.stringify(data),
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.ok).toBe(true);
    });

    test("Should handle special characters in message", async () => {
      const specialMessage =
        "Olá! Gostaria de agendar <script>alert('test')</script>";
      const data = { ...validContactData, message: specialMessage };

      const req = new NextRequest("http://localhost:3000/api/v1/contact", {
        method: "POST",
        headers: { "x-api-key": validApiKey },
        body: JSON.stringify(data),
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.ok).toBe(true);
    });

    test("Should handle accented characters in name", async () => {
      const data = {
        ...validContactData,
        name: "José María Ñoño",
      };

      const req = new NextRequest("http://localhost:3000/api/v1/contact", {
        method: "POST",
        headers: { "x-api-key": validApiKey },
        body: JSON.stringify(data),
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.ok).toBe(true);
    });
  });
});
