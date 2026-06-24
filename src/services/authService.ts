/**
 * Admin Authentication Service
 * 
 * Handles admin login with fallback support for both backend and local authentication.
 * Backend is attempted first, then falls back to local credentials if unavailable.
 */

const ADMIN_JWT_KEY = 'admin-jwt-token';
const ADMIN_SESSION_KEY = 'saif-seha-admin-session';
const ADMIN_LOGIN_ATTEMPTS_KEY = 'saif-seha-admin-login-attempts';
const ADMIN_MAX_FAILED_ATTEMPTS = 5;
const ADMIN_LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours
const ENABLE_LOCAL_ADMIN_FALLBACK = import.meta.env.VITE_ENABLE_LOCAL_ADMIN_FALLBACK === 'true';

interface AdminLoginAttempts {
  count: number;
  lockedUntil: number;
}

function isLocalFallbackAllowed(): boolean {
  return ENABLE_LOCAL_ADMIN_FALLBACK || import.meta.env.DEV;
}

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates login attempts and checks if locked out
 */
function getLoginLockStatus(): { locked: boolean; remainingSeconds: number } {
  try {
    const raw = window.localStorage.getItem(ADMIN_LOGIN_ATTEMPTS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<AdminLoginAttempts>) : {};
    const lockedUntil = Number(parsed.lockedUntil || 0);
    const now = Date.now();

    if (lockedUntil > now) {
      const remainingMs = lockedUntil - now;
      return { locked: true, remainingSeconds: Math.ceil(remainingMs / 1000) };
    }

    // Clear old lockout
    if (lockedUntil > 0) {
      window.localStorage.removeItem(ADMIN_LOGIN_ATTEMPTS_KEY);
    }

    return { locked: false, remainingSeconds: 0 };
  } catch {
    return { locked: false, remainingSeconds: 0 };
  }
}

/**
 * Records a failed login attempt
 */
function recordFailedLogin(): void {
  try {
    const raw = window.localStorage.getItem(ADMIN_LOGIN_ATTEMPTS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<AdminLoginAttempts>) : {};
    const count = Math.max(0, Number(parsed.count || 0)) + 1;
    const lockedUntil = count >= ADMIN_MAX_FAILED_ATTEMPTS ? Date.now() + ADMIN_LOCKOUT_MS : 0;
    window.localStorage.setItem(ADMIN_LOGIN_ATTEMPTS_KEY, JSON.stringify({ count, lockedUntil }));
  } catch {
    // Silently fail if storage unavailable
  }
}

/**
 * Clears failed login attempts
 */
function clearFailedLogins(): void {
  try {
    window.localStorage.removeItem(ADMIN_LOGIN_ATTEMPTS_KEY);
  } catch {
    // Silently fail
  }
}

/**
 * Creates a local session (for GitHub Pages / offline mode)
 */
function createLocalSession(): void {
  try {
    const expiresAt = Date.now() + SESSION_TTL_MS;
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ expiresAt }));
  } catch {
    // Silently fail if storage unavailable
  }
}

/**
 * Creates a session with JWT from backend
 */
function createBackendSession(token: string, expiresAt: number): void {
  try {
    window.sessionStorage.setItem(ADMIN_JWT_KEY, token);
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ expiresAt }));
  } catch {
    // Silently fail
  }
}

/**
 * Clears all admin sessions
 */
function clearSessions(): void {
  try {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    window.sessionStorage.removeItem(ADMIN_JWT_KEY);
  } catch {
    // Silently fail
  }
}

/**
 * Checks if user has a valid admin session
 */
export function hasValidSession(): boolean {
  try {
    const raw = window.sessionStorage.getItem(ADMIN_SESSION_KEY);
    const parsed = raw ? (JSON.parse(raw) as { expiresAt?: number }) : null;
    const expiresAt = Number(parsed?.expiresAt || 0);
    return expiresAt > Date.now();
  } catch {
    return false;
  }
}

/**
 * Gets JWT token from session storage
 */
export function getSessionToken(): string | null {
  try {
    return window.sessionStorage.getItem(ADMIN_JWT_KEY);
  } catch {
    return null;
  }
}

/**
 * Attempts to login with provided credentials
 * 
 * 1. Validates inputs
 * 2. Checks lockout status
 * 3. Tries backend authentication
 * 4. Falls back to local authentication if backend unavailable
 * 5. Manages session and attempt tracking
 */
export async function login(rawEmail: string, rawPassword: string): Promise<{
  success: boolean;
  error?: string;
}> {
  // Validate input format
  const email = String(rawEmail || '').trim().toLowerCase();
  const password = String(rawPassword || '');

  if (!email || !password) {
    return { success: false, error: 'البريد الإلكتروني وكلمة المرور مطلوبان.' };
  }

  if (!isValidEmail(email)) {
    return { success: false, error: 'صيغة البريد الإلكتروني غير صحيحة.' };
  }

  // Check lockout
  const lockStatus = getLoginLockStatus();
  if (lockStatus.locked) {
    const minutes = Math.ceil(lockStatus.remainingSeconds / 60);
    return {
      success: false,
      error: `تم إيقاف محاولات الدخول مؤقتاً. حاول بعد ${minutes} دقيقة.`,
    };
  }

  try {
    // Try backend authentication first
    try {
      const backendRes = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (backendRes.ok) {
        const data = await backendRes.json() as { token?: string; expiresAt?: number };
        if (data.token && data.expiresAt) {
          createBackendSession(data.token, data.expiresAt);
          clearFailedLogins();
          return { success: true };
        }
      }

      // Backend rejected credentials (401 = wrong credentials, not server error)
      if (backendRes.status === 401) {
        recordFailedLogin();
        clearSessions();
        return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' };
      }
    } catch (fetchError) {
      // Backend unavailable, continue to fallback when explicitly allowed
      console.warn('[authService] Backend unavailable, checking local fallback', fetchError);
    }

    // Fallback: use local credentials only when allowed
    const FALLBACK_ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || (import.meta.env.DEV ? 'admin@aseer.health.sa' : '')).toLowerCase().trim();
    const FALLBACK_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || (import.meta.env.DEV ? 'Aseer@2026' : '');

    if (isLocalFallbackAllowed() && email === FALLBACK_ADMIN_EMAIL && password === FALLBACK_ADMIN_PASSWORD) {
      createLocalSession();
      clearFailedLogins();
      return { success: true };
    }

    if (!isLocalFallbackAllowed()) {
      clearSessions();
      return { success: false, error: 'تعذّر الوصول إلى الخادم. حاول مرة أخرى لاحقاً.' };
    }

    // Both backend and fallback failed
    recordFailedLogin();
    clearSessions();
    return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' };
  } catch (error) {
    recordFailedLogin();
    clearSessions();
    console.error('[authService] Login error:', error);
    return {
      success: false,
      error: 'حدث خطأ أثناء محاولة تسجيل الدخول. يرجى المحاولة لاحقاً.',
    };
  }
}

/**
 * Logs out the current admin user
 */
export function logout(): void {
  clearSessions();
  clearFailedLogins();
}

/**
 * Gets remaining time in seconds until login lockout expires
 */
export function getLoginLockRemainingSeconds(): number {
  return getLoginLockStatus().remainingSeconds;
}
