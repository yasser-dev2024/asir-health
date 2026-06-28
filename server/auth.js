import jwt from 'jsonwebtoken';
import { timingSafeEqual } from 'crypto';

const IS_PROD = process.env.NODE_ENV === 'production';
const DEV_ADMIN_EMAIL = 'admin@aseer.health.sa';
const DEV_ADMIN_PASSWORD = 'change-me-local-only';
const DEV_JWT_SECRET = 'local-development-jwt-secret-change-me';

function envOrDev(name, devValue) {
  const value = process.env[name]?.trim();
  if (value) return value;
  if (IS_PROD) {
    throw new Error(`${name} is required in production`);
  }
  return devValue;
}

const JWT_SECRET = envOrDev('JWT_SECRET', DEV_JWT_SECRET);
const ADMIN_EMAIL = envOrDev('ADMIN_EMAIL', DEV_ADMIN_EMAIL).toLowerCase().trim();
const ADMIN_PASSWORD = envOrDev('ADMIN_PASSWORD', DEV_ADMIN_PASSWORD);
const TOKEN_TTL = '8h';

if (IS_PROD && JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters in production');
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function createAdminToken() {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export function verifyAdminToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export function requireAdmin(req, res, next) {
  const auth = req.headers.authorization ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

export function checkCredentials(email, password) {
  return (
    safeEqual(String(email).toLowerCase().trim(), ADMIN_EMAIL) &&
    safeEqual(String(password), ADMIN_PASSWORD)
  );
}
