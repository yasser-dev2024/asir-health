const dangerousPattern = /<script|<\/script|javascript:|vbscript:|onerror=|onload=|data:/gi;

function removeControlChars(value: string): string {
  return Array.from(value)
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code >= 32 && code !== 127;
    })
    .join('');
}

export function sanitizeText(value: string, maxLength = 1200): string {
  return removeControlChars(String(value ?? ''))
    .replace(dangerousPattern, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}

export function sanitizeList(values: string[]): string[] {
  return values
    .map((value) => sanitizeText(value))
    .filter((value, index, list) => value.length > 0 && list.indexOf(value) === index);
}

interface SafeUrlOptions {
  allowRelative?: boolean;
  allowedProtocols?: string[];
}

export function safeUrl(
  value: string,
  { allowRelative = true, allowedProtocols = ['https:', 'mailto:', 'tel:'] }: SafeUrlOptions = {}
): string {
  const cleaned = sanitizeText(value, 2048);
  if (!cleaned) {
    return '';
  }

  if (cleaned.includes('\\')) {
    return '';
  }

  const baseOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://local.invalid';

  try {
    if (cleaned.startsWith('/')) {
      if (!allowRelative || cleaned.startsWith('//')) {
        return '';
      }

      const url = new URL(cleaned, baseOrigin);
      return url.origin === baseOrigin ? `${url.pathname}${url.search}${url.hash}` : '';
    }

    const url = new URL(cleaned);
    if (!allowedProtocols.includes(url.protocol)) {
      return '';
    }

    if (url.protocol === 'https:') {
      return url.toString();
    }

    return cleaned;
  } catch {
    return '';
  }
}

export function createId(prefix: string): string {
  const random =
    typeof crypto !== 'undefined' && 'getRandomValues' in crypto
      ? Array.from(crypto.getRandomValues(new Uint8Array(6)), (byte) => byte.toString(36).padStart(2, '0')).join('')
      : Math.random().toString(36).slice(2, 14);

  return `${sanitizeText(prefix, 32) || 'id'}-${Date.now().toString(36)}-${random.slice(0, 12)}`;
}
