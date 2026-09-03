const KEY = "sd-scheduled-items";

export function getScheduledItems() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function setScheduledItems(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("sd:scheduled", { detail: items }));
  } catch (e) {
    // ignore
  }
}

export function addScheduledItem(item) {
  const cur = getScheduledItems();
  const entry = {
    id: item.id || `sched-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    productId: item.productId,
    name: item.name,
    qty: Math.max(1, Math.floor(Number(item.qty) || 1)),
    priceValue: Number(item.priceValue) || 0,
    img: item.img || "",
    scheduledAt: item.scheduledAt,
    date: item.date,
    time: item.time,
    createdAt: new Date().toISOString(),
  };
  const next = [entry, ...cur].slice(0, 30);
  setScheduledItems(next);
  return entry;
}

export function removeScheduledItem(id) {
  const next = getScheduledItems().filter((i) => i.id !== id);
  setScheduledItems(next);
  return next;
}

export function clearScheduledItems() {
  setScheduledItems([]);
}