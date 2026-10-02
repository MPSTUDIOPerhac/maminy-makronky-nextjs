// =========================================================
// Jednoduché přihlášení do administrace jedním sdíleným heslem.
// Žádná databáze uživatelů — jen jedno heslo uložené v proměnné
// prostředí ADMIN_PASSWORD. Po přihlášení se nastaví podepsaná
// cookie (HMAC), aby ji nešlo jen tak vyrobit zvenku.
// =========================================================

const crypto = require("crypto");

const COOKIE_NAME = "mm_admin_session";
const SESSION_HOURS = 12;

function getSecret() {
  const secret = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error(
      "Chybí SESSION_SECRET (nebo alespoň ADMIN_PASSWORD) v proměnných prostředí."
    );
  }
  return secret;
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

/** Vytvoří hodnotu session cookie platnou SESSION_HOURS hodin. */
function createSessionValue() {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = `ok.${expires}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

/** Ověří hodnotu session cookie. Vrací true/false. */
function verifySessionValue(value) {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [tag, expiresStr, signature] = parts;
  const payload = `${tag}.${expiresStr}`;
  const expected = sign(payload);
  const validSignature =
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  if (!validSignature) return false;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;
  return tag === "ok";
}

/** Pomocník pro API routy: zkontroluje, že požadavek má platnou admin session cookie. */
function isAuthenticated(request) {
  const cookie = request.cookies.get(COOKIE_NAME);
  return verifySessionValue(cookie?.value);
}

module.exports = {
  COOKIE_NAME,
  SESSION_HOURS,
  createSessionValue,
  verifySessionValue,
  isAuthenticated,
};
