import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { writeImage } from "@/lib/contentStore";

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB

function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // odstraní diakritiku
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function POST(request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Nejste přihlášeni." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder") === "menu" ? "menu" : "photos";

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Chybí soubor." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Soubor je příliš velký (max. 8 MB)." }, { status: 400 });
  }
  if (!file.type || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Nahraj prosím obrázek (JPG, PNG nebo WebP)." }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const baseName = slugify(file.name.replace(/\.[^.]+$/, "")) || "foto";
  const unique = Date.now().toString(36);
  const filename = `${baseName}-${unique}.${ext}`;
  const relPath = `public/images/${folder}/${filename}`;
  const publicSrc = `/images/${folder}/${filename}`;

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  await writeImage(relPath, base64, `Nahrána fotka ${filename}`);

  return NextResponse.json({ src: publicSrc });
}
