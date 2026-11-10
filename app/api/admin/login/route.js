import { NextResponse } from "next/server";
import { COOKIE_NAME, SESSION_HOURS, createSessionValue } from "@/lib/auth";
import {
  checkRateLimit,
  recordFailure,
  recordSuccess,
  getClientKey,
} from "@/lib/rateLimit";

export async function POST(request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Administrace zatím není nastavená (chybí ADMIN_PASSWORD na serveru)." },
      { status: 500 }
    );
  }

  const clientKey = getClientKey(request);
  const limit = checkRateLimit(clientKey);
  if (!limit.allowed) {
    const minutes = Math.ceil(limit.retryAfterSeconds / 60);
    return NextResponse.json(
      {
        error: `Příliš mnoho neúspěšných pokusů o přihlášení. Zkuste to prosím znovu za ${minutes} min.`,
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let password = "";
  try {
    const body = await request.json();
    password = body.password || "";
  } catch {
    return NextResponse.json({ error: "Neplatný požadavek." }, { status: 400 });
  }

  if (password !== adminPassword) {
    recordFailure(clientKey);
    return NextResponse.json({ error: "Nesprávné heslo." }, { status: 401 });
  }

  recordSuccess(clientKey);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, createSessionValue(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
  return res;
}
