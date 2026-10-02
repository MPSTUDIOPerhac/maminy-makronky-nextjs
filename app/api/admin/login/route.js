import { NextResponse } from "next/server";
import { COOKIE_NAME, SESSION_HOURS, createSessionValue } from "@/lib/auth";

export async function POST(request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Administrace zatím není nastavená (chybí ADMIN_PASSWORD na serveru)." },
      { status: 500 }
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
    return NextResponse.json({ error: "Nesprávné heslo." }, { status: 401 });
  }

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
