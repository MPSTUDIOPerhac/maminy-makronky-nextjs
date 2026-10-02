// =========================================================
// Úložiště obsahu pro admin panel.
//
// V PRODUKCI (na Vercelu) se soubory s obsahem (content/menu.json,
// content/gallery.json) a nahrané fotky (public/images/...) ukládají
// přímo do GitHub repozitáře přes GitHub API. Každá uložená změna je
// tedy normální git commit — Vercel ho automaticky zachytí a web za
// cca půl minuty znovu nasadí s novým obsahem. Nikde tu neběží žádná
// vlastní databáze.
//
// LOKÁLNĚ (při `npm run dev` bez nastavených GITHUB_* proměnných) se
// soubory čtou a zapisují rovnou na disk — kvůli pohodlnému vývoji a
// testování, aniž by bylo nutné mít po ruce GitHub token.
// =========================================================

const fs = require("fs");
const path = require("path");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

const useGitHub = Boolean(GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO);

function ghHeaders() {
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function ghUrl(filePath) {
  return `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
}

/** Načte soubor z GitHubu. Vrací { content (string), sha } nebo null, pokud neexistuje. */
async function ghGetFile(filePath) {
  const res = await fetch(`${ghUrl(filePath)}?ref=${GITHUB_BRANCH}`, {
    headers: ghHeaders(),
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub GET ${filePath} selhal: ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  const content = Buffer.from(json.content, "base64").toString("utf-8");
  return { content, sha: json.sha };
}

/** Zapíše (vytvoří/aktualizuje) soubor na GitHubu. content může být string nebo Buffer. */
async function ghPutFile(filePath, content, message) {
  const existing = await ghGetFile(filePath).catch(() => null);
  const body = {
    message,
    content: Buffer.isBuffer(content)
      ? content.toString("base64")
      : Buffer.from(content, "utf-8").toString("base64"),
    branch: GITHUB_BRANCH,
  };
  if (existing) body.sha = existing.sha;

  const res = await fetch(ghUrl(filePath), {
    method: "PUT",
    headers: { ...ghHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`GitHub PUT ${filePath} selhal: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

/** Smaže soubor na GitHubu. */
async function ghDeleteFile(filePath, message) {
  const existing = await ghGetFile(filePath);
  if (!existing) return; // už neexistuje, nic se neděje
  const res = await fetch(ghUrl(filePath), {
    method: "DELETE",
    headers: { ...ghHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ message, sha: existing.sha, branch: GITHUB_BRANCH }),
  });
  if (!res.ok) {
    throw new Error(`GitHub DELETE ${filePath} selhal: ${res.status} ${await res.text()}`);
  }
}

// ---------------------------------------------------------
// Lokální (souborový) fallback pro vývoj bez GitHub tokenu
// ---------------------------------------------------------
function localPath(relPath) {
  // V produkci se tahle větev vůbec nepoužije (tam běží GitHub API cesta výše) —
  // tohle je jen pohodlný fallback pro `npm run dev` na vlastním počítači, takže
  // Next.js nemusí kvůli téhle dynamické cestě trasovat/balit celý projekt.
  return path.join(/* turbopackIgnore: true */ process.cwd(), relPath);
}

function localReadFile(relPath) {
  const p = localPath(relPath);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, "utf-8");
}

function localWriteFile(relPath, content) {
  const p = localPath(relPath);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}

function localDeleteFile(relPath) {
  const p = localPath(relPath);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

// ---------------------------------------------------------
// Veřejné API — stejné bez ohledu na to, jestli běží přes GitHub,
// nebo lokálně na disku.
// ---------------------------------------------------------

/** Přečte JSON soubor z content/ (např. "content/menu.json"). Vrací pole/objekt. */
async function readJSON(relPath) {
  if (useGitHub) {
    const file = await ghGetFile(relPath);
    return file ? JSON.parse(file.content) : [];
  }
  const raw = localReadFile(relPath);
  return raw ? JSON.parse(raw) : [];
}

/** Zapíše JSON soubor do content/. */
async function writeJSON(relPath, data, message) {
  const content = JSON.stringify(data, null, 2) + "\n";
  if (useGitHub) {
    await ghPutFile(relPath, content, message);
  } else {
    localWriteFile(relPath, content);
  }
}

/**
 * Uloží nahranou fotku (base64 bez data: prefixu) na danou cestu
 * uvnitř public/ (např. "public/images/photos/novy-dort.jpg").
 */
async function writeImage(relPath, base64Content, message) {
  if (useGitHub) {
    await ghPutFile(relPath, Buffer.from(base64Content, "base64"), message);
  } else {
    localWriteFile(relPath, Buffer.from(base64Content, "base64"));
  }
}

/** Smaže soubor (fotku) z public/. */
async function deleteFile(relPath, message) {
  if (useGitHub) {
    await ghDeleteFile(relPath, message);
  } else {
    localDeleteFile(relPath);
  }
}

module.exports = {
  useGitHub,
  readJSON,
  writeJSON,
  writeImage,
  deleteFile,
};
