import type { InvoiceDraft } from '../types/invoice';

const SESSION_KEY = 'gst-invoice-draft:v1:session';
const LOCAL_KEY = 'gst-invoice-draft:v1:local';

const tryParse = (raw: string | null) => {
  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as InvoiceDraft;
  } catch {
    return undefined;
  }
};

export const loadDraftFromStorage = (): InvoiceDraft | undefined => {
  const sessionDraft = tryParse(sessionStorage.getItem(SESSION_KEY));
  if (sessionDraft) {
    return sessionDraft;
  }

  return tryParse(localStorage.getItem(LOCAL_KEY));
};

export const saveDraftToStorage = (draft: InvoiceDraft, mode: 'session' | 'local') => {
  const payload = JSON.stringify(draft);

  if (mode === 'local') {
    localStorage.setItem(LOCAL_KEY, payload);
    sessionStorage.removeItem(SESSION_KEY);
    return;
  }

  sessionStorage.setItem(SESSION_KEY, payload);
  localStorage.removeItem(LOCAL_KEY);
};

export const clearDraftStorage = () => {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(LOCAL_KEY);
};

export const exportDraftJson = (draft: InvoiceDraft) => {
  const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `invoice-draft-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const readDraftFile = async (file: File): Promise<InvoiceDraft> => {
  const text = await file.text();
  return JSON.parse(text) as InvoiceDraft;
};
