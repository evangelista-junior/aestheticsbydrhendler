/**
 * @jest-environment node
 */

import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/v1/treatments/route";

describe("GET /api/treatments", () => {
  const validApiKey = process.env.API_KEY;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleLog = console.log;

  beforeAll(() => {
    console.error = jest.fn();
    console.warn = jest.fn();
    console.log = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    console.log = originalConsoleLog;
  });

  describe("Authentication", () => {
    test("No API key: Must return 401", async () => {
      const req = new NextRequest("http://localhost:3000/api/v1/treatments");

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(401);
      expect(body).toEqual({ ok: false, message: "Access denied!" });
    });

    test("Wrong API key: Must return 401", async () => {
      const req = new NextRequest("http://localhost:3000/api/v1/treatments", {
        headers: { "x-api-key": "invalid-key" },
      });

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(401);
      expect(body).toEqual({ ok: false, message: "Access denied!" });
    });
  });

  describe("GET: List all treatments", () => {
    test("Get all treatments and validate fields", async () => {
      const req = new NextRequest("http://localhost:3000/api/v1/treatments", {
        headers: { "x-api-key": validApiKey || "" },
      });

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.treatments.length).toBeGreaterThan(0);

      expect(body.treatments[0]).toHaveProperty("id");
      expect(body.treatments[0]).toHaveProperty("stripeProductNumber");
      expect(body.treatments[0]).toHaveProperty("imageUrl");
      expect(body.treatments[0]).toHaveProperty("name");
      expect(body.treatments[0]).toHaveProperty("description");
      expect(body.treatments[0]).toHaveProperty("availability");
      expect(body.treatments[0]).toHaveProperty("hasBlogContent");
      expect(body.treatments[0]).toHaveProperty("createdAt");
    });
  });

  describe("GET with especific fields selection (?fields=)", () => {
    it("Return specific fields when used: ?fields=", async () => {
      const req = new NextRequest(
        "http://localhost:3000/api/v1/treatments?fields=id,name",
        {
          headers: { "x-api-key": validApiKey || "" },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.treatments.length).toBeGreaterThan(0);

      expect(body.treatments[0]).toHaveProperty("id");
      expect(body.treatments[0]).toHaveProperty("name");

      expect(body.treatments[0]).not.toHaveProperty("stripeProductNumber");
      expect(body.treatments[0]).not.toHaveProperty("imageUrl");
      expect(body.treatments[0]).not.toHaveProperty("description");
      expect(body.treatments[0]).not.toHaveProperty("availability");
      expect(body.treatments[0]).not.toHaveProperty("hasBlogContent");
      expect(body.treatments[0]).not.toHaveProperty("createdAt");
    });

    it("Ignore invalid fields no ?fields=", async () => {
      const req = new NextRequest(
        "http://localhost:3000/api/v1/treatments?fields=id,campoInvalido,name",
        {
          headers: { "x-api-key": validApiKey || "" },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.treatments[0]).toHaveProperty("id");
      expect(body.treatments[0]).toHaveProperty("name");
      expect(body.treatments[0]).not.toHaveProperty("campoInvalido");
    });

    it("Return all fields when ?fields= is empty", async () => {
      const req = new NextRequest(
        "http://localhost:3000/api/v1/treatments?fields=",
        {
          headers: { "x-api-key": validApiKey || "" },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(200);

      expect(body.treatments[0]).toHaveProperty("id");
      expect(body.treatments[0]).toHaveProperty("stripeProductNumber");
      expect(body.treatments[0]).toHaveProperty("imageUrl");
      expect(body.treatments[0]).toHaveProperty("name");
      expect(body.treatments[0]).toHaveProperty("description");
      expect(body.treatments[0]).toHaveProperty("availability");
      expect(body.treatments[0]).toHaveProperty("hasBlogContent");
      expect(body.treatments[0]).toHaveProperty("createdAt");
    });
  });

  describe("Listing with status selection (?status=AVAILABLE)", () => {
    it("Return only available treatments when given ?status=AVAILABLE", async () => {
      const req = new NextRequest(
        "http://localhost:3000/api/v1/treatments?status=AVAILABLE",
        {
          headers: { "x-api-key": validApiKey || "" },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.treatments).toHaveLength(3);
      expect(
        body.treatments.every((t: any) => t.availability === "AVAILABLE")
      ).toBe(true);
    });

    it("Return all items when ?status is different than AVAILABLE or SOON", async () => {
      const req = new NextRequest(
        "http://localhost:3000/api/v1/treatments?status=OTHER",
        {
          headers: { "x-api-key": validApiKey || "" },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.treatments.length).toBeGreaterThan(0);
    });
  });

  describe("Listing with fields combination", () => {
    it("Combine ?fields= and ?status=AVAILABLE correctly", async () => {
      const req = new NextRequest(
        "http://localhost:3000/api/v1/treatments?fields=id,name&status=AVAILABLE",
        {
          headers: { "x-api-key": validApiKey || "" },
        }
      );

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.treatments).toHaveLength(3);
      expect(body.treatments[0]).toHaveProperty("id");
      expect(body.treatments[0]).toHaveProperty("name");

      expect(body.treatments[0]).not.toHaveProperty("stripeProductNumber");
      expect(body.treatments[0]).not.toHaveProperty("imageUrl");
      expect(body.treatments[0]).not.toHaveProperty("description");
      expect(body.treatments[0]).not.toHaveProperty("availability");
      expect(body.treatments[0]).not.toHaveProperty("hasBlogContent");
      expect(body.treatments[0]).not.toHaveProperty("createdAt");
    });
  });

  describe("Error case", () => {
    it("Return 500 when there's an error on the Database", async () => {
      const originalFindMany = prisma.treatments.findMany;
      prisma.treatments.findMany = jest
        .fn()
        .mockRejectedValueOnce(new Error("Database error"));

      const req = new NextRequest("http://localhost:3000/api/v1/treatments", {
        headers: { "x-api-key": validApiKey || "" },
      });

      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body).toHaveProperty("error");

      prisma.treatments.findMany = originalFindMany;
    });
  });
});
