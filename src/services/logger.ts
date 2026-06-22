type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}

const key = 'saif-seha-logs';

export function logEvent(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  const entry: LogEntry = {
    level,
    message,
    createdAt: new Date().toISOString(),
    ...(meta ? { meta } : {}),
  };

  try {
    const current = readLogs();
    window.localStorage.setItem(key, JSON.stringify([entry, ...current].slice(0, 100)));
  } catch {
    // Logging must never break the user flow.
  }
}

export function readLogs(): LogEntry[] {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as LogEntry[]) : [];
  } catch {
    return [];
  }
}
