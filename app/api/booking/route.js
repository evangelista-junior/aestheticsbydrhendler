export async function POST(request) {
  try {
    const data = await request.json();

    // validação simples
    const required = ["name", "email", "phone", "service"];
    const missing = required.filter(
      (k) => !data?.[k] || String(data[k]).trim() === ""
    );
    if (missing.length) {
      return Response.json(
        {
          ok: false,
          message: `Missing required fields: ${missing.join(", ")}`,
        },
        { status: 400 }
      );
    }
    if (data.consent !== true) {
      return Response.json(
        { ok: false, message: "Consent is required." },
        { status: 400 }
      );
    }

    // 👉 Aqui você integra (exemplos):
    // 1) Enviar email (nodemailer + SMTP)
    // 2) Salvar em DB (Prisma, Mongo, etc.)
    // 3) Chamar provedor externo (Cliniko/Timely/HotDoc) via fetch

    // Exemplo de log (remova em produção):
    console.log("[BOOKING]", {
      name: data.name,
      email: data.email,
      phone: data.phone,
      service: data.service,
      date: data.date,
      time: data.time,
      notes: data.notes,
    });

    // Resposta de sucesso
    return Response.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Booking API error:", err);
    return Response.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
