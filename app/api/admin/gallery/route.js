import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { readJSON, writeJSON, deleteFile } from "@/lib/contentStore";

const GALLERY_PATH = "content/gallery.json";

function unauthorized() {
  return NextResponse.json({ error: "Nejste přihlášeni." }, { status: 401 });
}

export async function GET(request) {
  if (!isAuthenticated(request)) return unauthorized();
  const items = await readJSON(GALLERY_PATH);
  return NextResponse.json({ items });
}

export async function POST(request) {
  if (!isAuthenticated(request)) return unauthorized();
  const body = await request.json();
  const items = await readJSON(GALLERY_PATH);

  const id = "g" + Date.now().toString(36);
  const newItem = {
    id,
    cat: body.cat || "klasika",
    label: body.label || "",
    ar: body.ar || "1/1",
    src: body.src || "",
    alt: body.alt || body.label || "",
    caption: body.caption || body.label || "",
  };
  items.push(newItem);
  await writeJSON(GALLERY_PATH, items, `Galerie: přidána fotka „${newItem.label}“`);
  return NextResponse.json({ item: newItem });
}

export async function DELETE(request) {
  if (!isAuthenticated(request)) return unauthorized();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Chybí id fotky." }, { status: 400 });

  const items = await readJSON(GALLERY_PATH);
  const item = items.find((it) => it.id === id);
  const filtered = items.filter((it) => it.id !== id);
  await writeJSON(GALLERY_PATH, filtered, `Galerie: smazána fotka „${item?.label || id}“`);

  // Smažeme i samotný soubor fotky, pokud k ní máme cestu (public/images/...).
  if (item?.src) {
    const relPath = "public" + item.src; // src je např. "/images/photos/xyz.jpg"
    try {
      await deleteFile(relPath, `Galerie: smazán soubor fotky „${item.label}“`);
    } catch {
      // Soubor se třeba už nepovedlo najít — nevadí, záznam v galerii je pryč.
    }
  }

  return NextResponse.json({ ok: true });
}
