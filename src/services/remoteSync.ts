import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type {
  AwarenessContent,
  DoctorAssistantQuestion,
  HealthEvent,
  KeywordAnswer,
  QrLocation,
  SmartEntryConfig,
} from '../types/domain';

// ── Row mappers ────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

function eventToRow(e: HealthEvent): Row {
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    location: e.location,
    date: e.date,
    time: e.time,
    audience: e.audience,
    category: e.category,
    map_url: e.mapUrl,
    active: e.active,
    tone: e.tone,
  };
}

function rowToEvent(r: Row): HealthEvent {
  return {
    id: String(r.id ?? ''),
    title: String(r.title ?? ''),
    description: String(r.description ?? ''),
    location: String(r.location ?? ''),
    date: String(r.date ?? ''),
    time: String(r.time ?? ''),
    audience: String(r.audience ?? ''),
    category: String(r.category ?? ''),
    mapUrl: String(r.map_url ?? ''),
    visits: 0,
    active: Boolean(r.active ?? true),
    tone: (r.tone ?? 'green') as HealthEvent['tone'],
  };
}

function contentToRow(c: AwarenessContent): Row {
  return {
    id: c.id,
    title: c.title,
    type: c.type,
    summary: c.summary,
    category: c.category,
    action_label: c.actionLabel,
    file_url: c.fileUrl,
    active: c.active,
    updated_at: c.updatedAt,
  };
}

function rowToContent(r: Row): AwarenessContent {
  return {
    id: String(r.id ?? ''),
    title: String(r.title ?? ''),
    type: (r.type ?? 'post') as AwarenessContent['type'],
    summary: String(r.summary ?? ''),
    category: String(r.category ?? ''),
    actionLabel: String(r.action_label ?? ''),
    fileUrl: String(r.file_url ?? ''),
    active: Boolean(r.active ?? true),
    updatedAt: String(r.updated_at ?? ''),
  };
}

function keywordToRow(k: KeywordAnswer): Row {
  return {
    id: k.id,
    question: k.question,
    keywords: k.keywords,
    answer: k.answer,
    link_label: k.linkLabel,
    link_url: k.linkUrl,
    image_url: k.imageUrl,
    cta_label: k.ctaLabel,
    cta_url: k.ctaUrl,
    active: k.active,
    updated_at: k.updatedAt,
  };
}

function rowToKeyword(r: Row): KeywordAnswer {
  return {
    id: String(r.id ?? ''),
    question: String(r.question ?? ''),
    keywords: Array.isArray(r.keywords) ? (r.keywords as string[]).map(String) : [],
    answer: String(r.answer ?? ''),
    linkLabel: String(r.link_label ?? ''),
    linkUrl: String(r.link_url ?? ''),
    imageUrl: String(r.image_url ?? ''),
    ctaLabel: String(r.cta_label ?? ''),
    ctaUrl: String(r.cta_url ?? ''),
    active: Boolean(r.active ?? true),
    usage: 0,
    updatedAt: String(r.updated_at ?? ''),
  };
}

function doctorToRow(q: DoctorAssistantQuestion): Row {
  return {
    id: q.id,
    question: q.question,
    answer: q.answer,
    keywords: q.keywords,
    active: q.active,
    order: q.order,
    updated_at: q.updatedAt,
  };
}

function rowToDoctor(r: Row): DoctorAssistantQuestion {
  return {
    id: String(r.id ?? ''),
    question: String(r.question ?? ''),
    answer: String(r.answer ?? ''),
    keywords: Array.isArray(r.keywords) ? (r.keywords as string[]).map(String) : [],
    active: Boolean(r.active ?? true),
    order: Number(r.order ?? 999),
    updatedAt: String(r.updated_at ?? ''),
  };
}

function qrLocationToRow(l: QrLocation): Row {
  return {
    id: l.id,
    name: l.name,
    description: l.description,
    slug: l.slug,
    active: l.active,
    created_at: l.createdAt,
  };
}

function rowToQrLocation(r: Row, existingLocations: QrLocation[] = []): QrLocation {
  const existing = existingLocations.find((l) => l.id === r.id);
  return {
    id: String(r.id ?? ''),
    name: String(r.name ?? ''),
    description: String(r.description ?? ''),
    slug: String(r.slug ?? ''),
    active: Boolean(r.active ?? true),
    scans: existing?.scans ?? 0,
    lastScanAt: existing?.lastScanAt ?? '',
    createdAt: String(r.created_at ?? ''),
  };
}

// ── Safe async wrapper ─────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function safe(fn: () => PromiseLike<any>): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await fn();
  } catch {
    // Remote sync is best-effort; never break the local flow
  }
}

// ── Per-entity upsert / delete ─────────────────────────────────────────────

export function upsertRemoteEvent(event: HealthEvent): Promise<void> {
  return safe(() => supabase!.from('aser_events').upsert(eventToRow(event)));
}

export function deleteRemoteEvent(id: string): Promise<void> {
  return safe(() => supabase!.from('aser_events').delete().eq('id', id));
}

export function upsertRemoteContent(content: AwarenessContent): Promise<void> {
  return safe(() => supabase!.from('aser_contents').upsert(contentToRow(content)));
}

export function deleteRemoteContent(id: string): Promise<void> {
  return safe(() => supabase!.from('aser_contents').delete().eq('id', id));
}

export function upsertRemoteKeyword(keyword: KeywordAnswer): Promise<void> {
  return safe(() => supabase!.from('aser_keywords').upsert(keywordToRow(keyword)));
}

export function deleteRemoteKeyword(id: string): Promise<void> {
  return safe(() => supabase!.from('aser_keywords').delete().eq('id', id));
}

export function upsertRemoteDoctorQuestion(question: DoctorAssistantQuestion): Promise<void> {
  return safe(() => supabase!.from('aser_doctor_questions').upsert(doctorToRow(question)));
}

export function deleteRemoteDoctorQuestion(id: string): Promise<void> {
  return safe(() => supabase!.from('aser_doctor_questions').delete().eq('id', id));
}

export function upsertRemoteQrLocation(location: QrLocation): Promise<void> {
  return safe(() => supabase!.from('aser_qr_locations').upsert(qrLocationToRow(location)));
}

export function deleteRemoteQrLocation(id: string): Promise<void> {
  return safe(() => supabase!.from('aser_qr_locations').delete().eq('id', id));
}

export function upsertRemoteSmartEntryConfig(config: SmartEntryConfig): Promise<void> {
  return safe(() =>
    supabase!
      .from('aser_smart_entry_config')
      .upsert({ id: 1, config, updated_at: new Date().toISOString() })
  );
}

// ── Snapshot types ─────────────────────────────────────────────────────────

export interface RemoteSnapshot {
  events: HealthEvent[];
  contents: AwarenessContent[];
  keywordAnswers: KeywordAnswer[];
  doctorAssistantQuestions: DoctorAssistantQuestion[];
  qrLocations: QrLocation[];
  smartEntryConfig: SmartEntryConfig | null;
}

export interface LocalSeedData {
  events: HealthEvent[];
  contents: AwarenessContent[];
  keywordAnswers: KeywordAnswer[];
  doctorAssistantQuestions: DoctorAssistantQuestion[];
  qrLocations: QrLocation[];
  smartEntryConfig: SmartEntryConfig;
}

// ── Fetch all remote data ──────────────────────────────────────────────────

export async function fetchRemoteSnapshot(existingLocations: QrLocation[] = []): Promise<RemoteSnapshot | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const [eventsRes, contentsRes, keywordsRes, doctorRes, qrRes, configRes] = await Promise.allSettled([
      supabase.from('aser_events').select('*').order('created_at', { ascending: false }),
      supabase.from('aser_contents').select('*').order('created_at', { ascending: false }),
      supabase.from('aser_keywords').select('*').order('created_at', { ascending: false }),
      supabase.from('aser_doctor_questions').select('*').order('order', { ascending: true }),
      supabase.from('aser_qr_locations').select('*').order('created_at', { ascending: false }),
      supabase.from('aser_smart_entry_config').select('config').eq('id', 1).maybeSingle(),
    ]);

    return {
      events:
        eventsRes.status === 'fulfilled' && Array.isArray(eventsRes.value.data)
          ? eventsRes.value.data.map(rowToEvent)
          : [],
      contents:
        contentsRes.status === 'fulfilled' && Array.isArray(contentsRes.value.data)
          ? contentsRes.value.data.map(rowToContent)
          : [],
      keywordAnswers:
        keywordsRes.status === 'fulfilled' && Array.isArray(keywordsRes.value.data)
          ? keywordsRes.value.data.map(rowToKeyword)
          : [],
      doctorAssistantQuestions:
        doctorRes.status === 'fulfilled' && Array.isArray(doctorRes.value.data)
          ? doctorRes.value.data.map(rowToDoctor)
          : [],
      qrLocations:
        qrRes.status === 'fulfilled' && Array.isArray(qrRes.value.data)
          ? qrRes.value.data.map((r) => rowToQrLocation(r, existingLocations))
          : [],
      smartEntryConfig:
        configRes.status === 'fulfilled' && configRes.value.data
          ? (configRes.value.data.config as SmartEntryConfig)
          : null,
    };
  } catch {
    return null;
  }
}

// ── Seed remote from local (first-time Supabase setup) ────────────────────

export async function seedRemote(localData: LocalSeedData): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    await Promise.allSettled([
      supabase.from('aser_events').upsert(localData.events.map(eventToRow)),
      supabase.from('aser_contents').upsert(localData.contents.map(contentToRow)),
      supabase.from('aser_keywords').upsert(localData.keywordAnswers.map(keywordToRow)),
      supabase.from('aser_doctor_questions').upsert(localData.doctorAssistantQuestions.map(doctorToRow)),
      supabase.from('aser_qr_locations').upsert(localData.qrLocations.map(qrLocationToRow)),
      supabase
        .from('aser_smart_entry_config')
        .upsert({ id: 1, config: localData.smartEntryConfig, updated_at: new Date().toISOString() }),
    ]);
  } catch {
    // best-effort
  }
}
