import { getOrCreateVisitorId } from '../utils/privacy';

const COUNTER_API_BASE_URL = 'https://api.counterapi.dev/v1';
const DEFAULT_COUNTER_NAMESPACE = 'asir-maaeed-qr-locations';

interface CounterApiResponse {
  count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface QrCentralScanLogEntry {
  scanId: string;
  qrSlug: string;
  visitorId: string;
  dateTime: string;
  sequence: number;
}

export interface QrCentralStats {
  total: number;
  today: number;
  thisWeek: number;
  updatedAt: string;
  available: boolean;
  scanLogs: QrCentralScanLogEntry[];
}

const CENTRAL_SCAN_LOG_LIMIT = 5;

function getCounterNamespace() {
  const env = import.meta.env as ImportMetaEnv & {
    readonly APP_QR_COUNTER_NAMESPACE?: string;
    readonly VITE_QR_COUNTER_NAMESPACE?: string;
  };

  return (env.APP_QR_COUNTER_NAMESPACE || env.VITE_QR_COUNTER_NAMESPACE || DEFAULT_COUNTER_NAMESPACE)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || DEFAULT_COUNTER_NAMESPACE;
}

function safeCounterName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function requestUrl(counterName: string, action?: 'up' | 'set', count?: number) {
  const namespace = getCounterNamespace();
  const path = action ? `${counterName}/${action}` : `${counterName}/`;
  const url = new URL(`${COUNTER_API_BASE_URL}/${namespace}/${path}`);
  if (action === 'set' && Number.isFinite(count)) {
    url.searchParams.set('count', String(Math.max(0, Math.floor(Number(count)))));
  }

  return url.toString();
}

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function weekKey(date = new Date()) {
  const current = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = current.getUTCDay() || 7;
  current.setUTCDate(current.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(current.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((current.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${current.getUTCFullYear()}-w${String(week).padStart(2, '0')}`;
}

function counterNames(slug: string) {
  const safeSlug = safeCounterName(slug);
  if (!safeSlug) {
    return null;
  }

  return {
    total: `qr-${safeSlug}`,
    today: `qr-${safeSlug}-day-${todayKey()}`,
    thisWeek: `qr-${safeSlug}-week-${weekKey()}`,
  };
}

function scanLogCounterNames(slug: string, sequence: number) {
  const safeSlug = safeCounterName(slug);
  const safeSequence = Math.floor(Number(sequence));

  if (!safeSlug || !Number.isFinite(safeSequence) || safeSequence < 1) {
    return null;
  }

  return {
    timestamp: `qr-${safeSlug}-scan-${safeSequence}-time`,
    visitor: `qr-${safeSlug}-scan-${safeSequence}-visitor`,
    source: `qr-${safeSlug}-scan-${safeSequence}-source`,
  };
}

function positiveHash(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function dateTimeFromCounter(counter: CounterApiResponse | null) {
  const timestamp = Number(counter?.count || 0);

  if (timestamp > 0) {
    const date = new Date(timestamp);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString();
    }
  }

  return counter?.updated_at || counter?.created_at || '';
}

async function fetchCounter(counterName: string, action?: 'up' | 'set', count?: number) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(requestUrl(counterName, action, count), {
      cache: 'no-store',
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.status === 400 || response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Counter API ${response.status}`);
    }

    return (await response.json()) as CounterApiResponse;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
}

async function fetchCentralScanLogs(slug: string, totalCount: number, limit = CENTRAL_SCAN_LOG_LIMIT) {
  const safeSlug = safeCounterName(slug);
  const total = Math.max(0, Math.floor(Number(totalCount)));

  if (!safeSlug || total < 1) {
    return [];
  }

  const start = Math.max(1, total - Math.max(1, limit) + 1);
  const sequences = Array.from({ length: total - start + 1 }, (_, index) => total - index);
  const rows = await Promise.all(
    sequences.map(async (sequence) => {
      const names = scanLogCounterNames(safeSlug, sequence);

      if (!names) {
        return null;
      }

      const [timestampResult, visitorResult] = await Promise.allSettled([
        fetchCounter(names.timestamp),
        fetchCounter(names.visitor),
      ]);
      const timestamp = timestampResult.status === 'fulfilled' ? timestampResult.value : null;
      const dateTime = dateTimeFromCounter(timestamp);

      if (!dateTime) {
        return null;
      }

      const visitor = visitorResult.status === 'fulfilled' ? visitorResult.value : null;
      const visitorHash = Number(visitor?.count || 0);

      return {
        scanId: `central-${safeSlug}-${sequence}`,
        qrSlug: safeSlug,
        visitorId: visitorHash > 0 ? `visitor-${visitorHash.toString(36)}` : 'visitor-unknown',
        dateTime,
        sequence,
      } satisfies QrCentralScanLogEntry;
    })
  );

  return rows.filter((row): row is QrCentralScanLogEntry => Boolean(row));
}

export async function syncQrScanToCentralCounter(slug: string, sourceUrl = '') {
  if (!slug) {
    return;
  }

  const visitorId = getOrCreateVisitorId();
  const names = counterNames(slug);
  if (!names) {
    return;
  }

  const [totalResult] = await Promise.allSettled([
    fetchCounter(names.total, 'up'),
    fetchCounter(names.today, 'up'),
    fetchCounter(names.thisWeek, 'up'),
  ]);

  const total = totalResult.status === 'fulfilled' ? totalResult.value : null;
  const sequence = Number(total?.count || 0);
  const scanLogNames = scanLogCounterNames(slug, sequence);

  if (!scanLogNames) {
    return;
  }

  await Promise.allSettled([
    fetchCounter(scanLogNames.timestamp, 'set', Date.now()),
    fetchCounter(scanLogNames.visitor, 'set', positiveHash(visitorId)),
    fetchCounter(scanLogNames.source, 'set', positiveHash(sourceUrl)),
  ]);
}

export async function fetchQrCentralStats(slug: string): Promise<QrCentralStats> {
  const names = counterNames(slug);
  if (!names) {
    return {
      total: 0,
      today: 0,
      thisWeek: 0,
      updatedAt: '',
      available: false,
      scanLogs: [],
    };
  }

  const [total, today, thisWeek] = await Promise.allSettled([
    fetchCounter(names.total),
    fetchCounter(names.today),
    fetchCounter(names.thisWeek),
  ]);
  const totalValue = total.status === 'fulfilled' ? total.value : null;
  const todayValue = today.status === 'fulfilled' ? today.value : null;
  const thisWeekValue = thisWeek.status === 'fulfilled' ? thisWeek.value : null;
  const totalCount = Number(totalValue?.count || 0);

  return {
    total: totalCount,
    today: Number(todayValue?.count || 0),
    thisWeek: Number(thisWeekValue?.count || 0),
    updatedAt: totalValue?.updated_at || '',
    available: Boolean(totalValue || todayValue || thisWeekValue),
    scanLogs: await fetchCentralScanLogs(slug, totalCount),
  };
}
