export const NOTE_MAX = 200;
export const BAKER_NOTE_MAX = 200;

export function validateOrderNotes({ driverNote, bakerNote }) {
  const errors = {};
  if (driverNote != null && String(driverNote).length > NOTE_MAX) {
    errors.driverNote = `Driver instructions must be ${NOTE_MAX} characters or fewer.`;
  }
  if (bakerNote != null && String(bakerNote).length > BAKER_NOTE_MAX) {
    errors.bakerNote = `Note to baker must be ${BAKER_NOTE_MAX} characters or fewer.`;
  }
  return errors;
}

export function normalizeNotes(driverNote, bakerNote) {
  return {
    driverNote: String(driverNote || "").trim().slice(0, NOTE_MAX),
    bakerNote: String(bakerNote || "").trim().slice(0, BAKER_NOTE_MAX),
  };
}