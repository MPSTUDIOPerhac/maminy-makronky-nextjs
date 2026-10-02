import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { readJSON, writeJSON } from "@/lib/contentStore";

const MENU_PATH = "content/menu.json";

function unauthorized() {
  return NextResponse.json({ error: "Nejste přihlášeni." }, { status: 401 });
}

export async function GET(request) {
  if (!isAuthenticated(request)) return unauthorized();
  const items = await readJSON(MENU_PATH);
  return NextResponse.json({ items });
}

export async function POST(request) {
  if (!isAuthenticated(request)) return unauthorized();
  const body = await request.json();
  const items = await readJSON(MENU_PATH);

  const id = "m" + Date.now().toString(36);
  const newItem = {
    id,
    category: body.category || "",
    name: body.name || "",
    price: body.price || "",
    flavors: body.flavors || "",
    description: body.description || "",
    photo: body.photo || "",
  };
  items.push(newItem);
  await writeJSON(MENU_PATH, items, `Nabídka: přidána položka „${newItem.name}“`);
  return NextResponse.json({ item: newItem });
}

export async function PUT(request) {
  if (!isAuthenticated(request)) return unauthorized();
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "Chybí id položky." }, { status: 400 });

  const items = await readJSON(MENU_PATH);
  const idx = items.findIndex((it) => it.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "Položka nenalezena." }, { status: 404 });

  items[idx] = {
    ...items[idx],
    category: body.category ?? items[idx].category,
    name: body.name ?? items[idx].name,
    price: body.price ?? items[idx].price,
    flavors: body.flavors ?? items[idx].flavors,
    description: body.description ?? items[idx].description,
    photo: body.photo ?? items[idx].photo,
  };
  await writeJSON(MENU_PATH, items, `Nabídka: upravena položka „${items[idx].name}“`);
  return NextResponse.json({ item: items[idx] });
}

export async function DELETE(request) {
  if (!isAuthenticated(request)) return unauthorized();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Chybí id položky." }, { status: 400 });

  const items = await readJSON(MENU_PATH);
  const item = items.find((it) => it.id === id);
  const filtered = items.filter((it) => it.id !== id);
  await writeJSON(MENU_PATH, filtered, `Nabídka: smazána položka „${item?.name || id}“`);
  return NextResponse.json({ ok: true });
}
