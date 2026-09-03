export const PREORDER_TIMES = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export function nextDayISO(now = new Date()) {
  const d = new Date(now.getTime());
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function buildScheduledAt(dateISO, time, now = new Date()) {
  if (!dateISO || !time) return null;
  const [hh, mm] = String(time).split(":").map((v) => parseInt(v, 10));
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  const d = new Date(dateISO + "T00:00:00");
  d.setHours(hh, mm, 0, 0);
  if (d.getTime() <= now.getTime()) {
    return null;
  }
  return d.toISOString();
}

export function countdownParts(target, now = new Date()) {
  if (!target) return { done: true, label: "", days: 0, hours: 0, minutes: 0, seconds: 0 };
  const ms = new Date(target).getTime() - now.getTime();
  if (ms <= 0) return { done: true, label: "Ready now", days: 0, hours: 0, minutes: 0, seconds: 0 };
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (days > 0 || hours > 0) parts.push(`${hours}h`);
  if (days === 0) parts.push(`${minutes}m`);
  if (days === 0 && hours === 0) parts.push(`${seconds}s`);
  return { done: false, label: parts.join(" "), days, hours, minutes, seconds };
}

export function formatScheduledFor(target) {
  if (!target) return "";
  const d = new Date(target);
  if (Number.isNaN(d.getTime())) return "";
  try {
    return d.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return d.toString();
  }
}