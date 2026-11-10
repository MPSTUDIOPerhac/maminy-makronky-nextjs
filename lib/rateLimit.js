// =========================================================
// Jednoduche omezeni poctu pokusu o prihlaseni do administrace,
// aby slo ztizit zkouseni hesla nazdarbuh (brute force utok).
//
// Pocitadlo zije jen v pameti bezici serverless funkce. Na malem
// webu s nizkym provozem to v praxi staci jako slusna prekazka
// (funkce bezi "zahrate" a opakovane pozadavky ze stejne IP na ni
// typicky trefi). Pro stoprocentni ochranu napric vsemi instancemi
// by bylo potreba sdilene uloziste (napr. Vercel KV / Upstash Redis),
// coz tento projekt zamerne nepouziva, aby zustal bez databaze.
// =========================================================

const MAX_ATTEMPTS = 5; // kolik spatnych hesel je povoleno
const WINDOW_MS = 10 * 60 * 1000; // za jake okno se pocitaji (10 minut)
const LOCKOUT_MS = 15 * 60 * 1000; // na jak dlouho se po prekroceni zamkne (15 minut)

const attempts = new Map(); // klic (IP) -> { count, firstAttempt, lockedUntil }

function cleanupOld(now) {
  for (const [key, entry] of attempts) {
    const expired =
      (entry.lockedUntil && entry.lockedUntil < now) ||
      (!entry.lockedUntil && now - entry.firstAttempt > WINDOW_MS);
    if (expired) attempts.delete(key);
  }
}

/**
 * Zkontroluje, jestli je dany klic (napr. IP adresa) prave zablokovany.
 * Vraci { allowed: true } nebo { allowed: false, retryAfterSeconds }.
 */
function checkRateLimit(key) {
  const now = Date.now();
  cleanupOld(now);
  const entry = attempts.get(key);
  if (entry && entry.lockedUntil && entry.lockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.lockedUntil - now) / 1000),
    };
  }
  return { allowed: true };
}

/** Zaznamena neuspesny pokus o prihlaseni; pri prekroceni limitu zamkne klic. */
function recordFailure(key) {
  const now = Date.now();
  let entry = attempts.get(key);
  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    entry = { count: 0, firstAttempt: now, lockedUntil: null };
  }
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
  }
  attempts.set(key, entry);
}

/** Po uspesnem prihlaseni vymaze pocitadlo pro dany klic. */
function recordSuccess(key) {
  attempts.delete(key);
}

/** Odvodi identifikator klienta (IP adresu) z hlavicek pozadavku na Vercelu. */
function getClientKey(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

module.exports = {
  checkRateLimit,
  recordFailure,
  recordSuccess,
  getClientKey,
};
