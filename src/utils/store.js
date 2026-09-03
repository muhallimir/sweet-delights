const KEY = "sd-store";

export const STORES = [
  {
    id: "poblacion",
    name: "Poblacion Main",
    address: "123 Plaza St, Poblacion, Philippines",
    phone: "0917 123 4567",
    hours: "Mon-Sat 8AM-8PM · Sun 9AM-6PM",
    map: "https://www.openstreetmap.org/export/embed.html?bbox=120.95%2C14.55%2C121.05%2C14.65&layer=mapnik",
  },
  {
    id: "calamba",
    name: "Calamba Branch",
    address: "45 Crossing Rd, Calamba, Laguna",
    phone: "0928 765 4321",
    hours: "Mon-Sun 9AM-7PM",
    map: "https://www.openstreetmap.org/export/embed.html?bbox=121.10%2C14.15%2C121.20%2C14.25&layer=mapnik",
  },
];

export function getStoreId() {
  try {
    const v = localStorage.getItem(KEY);
    if (v && STORES.some((s) => s.id === v)) return v;
    return "poblacion";
  } catch (e) {
    return "poblacion";
  }
}

export function setStoreId(id) {
  try {
    localStorage.setItem(KEY, id);
    const raw = localStorage.getItem("sd-fulfillment");
    if (raw) {
      const f = JSON.parse(raw);
      localStorage.setItem("sd-fulfillment", JSON.stringify({ ...f, storeId: id }));
    } else {
      localStorage.setItem("sd-fulfillment", JSON.stringify({ type: "delivery", date: "", slot: "", storeId: id }));
    }
  } catch (e) {
    // ignore
  }
}
