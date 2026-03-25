import { Era, BoardItem } from "./types";

const ERAS_KEY = "eraboard_eras";
const ITEMS_KEY = "eraboard_items";

// ─── Eras ────────────────────────────────────────────

export function getEras(): Era[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ERAS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveEras(eras: Era[]) {
  try {
    localStorage.setItem(ERAS_KEY, JSON.stringify(eras));
  } catch (e) {
    console.error("Failed to save eras", e);
  }
}

export function createEra(name: string, color: string): Era {
  const era: Era = {
    id: crypto.randomUUID(),
    name,
    color,
    createdAt: Date.now(),
  };
  const eras = getEras();
  eras.push(era);
  saveEras(eras);
  return era;
}

export function updateEra(id: string, updates: Partial<Era>) {
  const eras = getEras().map((e) => (e.id === id ? { ...e, ...updates } : e));
  saveEras(eras);
  return eras;
}

export function deleteEra(id: string) {
  const eras = getEras().filter((e) => e.id !== id);
  saveEras(eras);
  // Also delete all items for this era
  const items = getItems().filter((i) => i.eraId !== id);
  saveItems(items);
  return eras;
}

// ─── Board Items ─────────────────────────────────────

export function getItems(): BoardItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ITEMS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getItemsByEra(eraId: string): BoardItem[] {
  return getItems().filter((i) => i.eraId === eraId);
}

export function saveItems(items: BoardItem[]) {
  try {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      alert("Storage limit reached! Please remove some images to save new items.");
    }
    console.error("Failed to save items", e);
  }
}

export function addItem(item: BoardItem) {
  const items = getItems();
  items.push(item);
  saveItems(items);
  return item;
}

export function updateItem(id: string, updates: Partial<BoardItem>) {
  const items = getItems().map((i) =>
    i.id === id ? { ...i, ...updates } : i
  );
  saveItems(items);
  return items;
}

export function deleteItem(id: string) {
  const items = getItems().filter((i) => i.id !== id);
  saveItems(items);
  return items;
}

export function getMaxZIndex(eraId: string): number {
  const items = getItemsByEra(eraId);
  if (items.length === 0) return 0;
  return Math.max(...items.map((i) => i.zIndex));
}
