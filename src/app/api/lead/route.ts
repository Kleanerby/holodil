/**
 * Приём заявок с сайта.
 * Если заданы TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID (.env.local) — заявка уходит в Telegram.
 * Иначе пишется в лог сервера. TODO(content): подключить CRM / почту при необходимости.
 */
export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "bad json" }, { status: 400 });
  }
  const clean = (v: unknown, max: number) => String(v ?? "").replace(/[<>]/g, "").trim().slice(0, max);
  const phone = clean(data.phone, 30);
  if (phone.replace(/\D/g, "").length < 9) return Response.json({ error: "phone" }, { status: 422 });

  const text = [
    "❄️ Заявка с сайта",
    `Телефон: ${phone}`,
    `Имя: ${clean(data.name, 60) || "—"}`,
    `Проблема: ${clean(data.problem, 500) || "—"}`,
    `Страница: ${clean(data.page, 200)} (${clean(data.context, 150)})`,
  ].join("\n");

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (token && chat) {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text }),
    });
    if (!res.ok) return Response.json({ error: "delivery" }, { status: 502 });
  } else {
    console.log(`[lead]\n${text}`);
  }
  return Response.json({ ok: true });
}
