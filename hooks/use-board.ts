"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { BoardItem, NOTE_COLORS } from "@/lib/types";
import * as storage from "@/lib/storage";

export function useBoard(eraId: string | null) {
  const [items, setItems] = useState<BoardItem[]>([]);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load items when era changes
  useEffect(() => {
    if (!eraId) {
      setItems([]);
      return;
    }
    const loaded = storage.getItemsByEra(eraId);
    setItems(loaded);
  }, [eraId]);

  // Debounced save
  const debouncedSave = useCallback(
    (updatedItems: BoardItem[]) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        // Save all items (merge with other eras)
        const allItems = storage.getItems();
        const otherItems = allItems.filter((i) => i.eraId !== eraId);
        storage.saveItems([...otherItems, ...updatedItems]);
      }, 300);
    },
    [eraId]
  );

  const addNote = useCallback(
    (x: number, y: number) => {
      if (!eraId) return;
      const maxZ = storage.getMaxZIndex(eraId);
      const item: BoardItem = {
        id: crypto.randomUUID(),
        eraId,
        type: "note",
        x,
        y,
        width: 220,
        height: 200,
        rotation: Math.random() * 6 - 3, // slight random tilt
        zIndex: maxZ + 1,
        title: "",
        content: "",
        noteColor: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
        createdAt: Date.now(),
      };
      storage.addItem(item);
      setItems((prev) => [...prev, item]);
      return item;
    },
    [eraId]
  );

  const addText = useCallback(
    (x: number, y: number) => {
      if (!eraId) return;
      const maxZ = storage.getMaxZIndex(eraId);
      const item: BoardItem = {
        id: crypto.randomUUID(),
        eraId,
        type: "text",
        x,
        y,
        width: 300,
        height: 100,
        rotation: 0,
        zIndex: maxZ + 1,
        content: "Double click to edit...",
        createdAt: Date.now(),
      };
      storage.addItem(item);
      setItems((prev) => [...prev, item]);
      return item;
    },
    [eraId]
  );

  const addImage = useCallback(
    (imageUrl: string, x: number, y: number) => {
      if (!eraId) return;
      const maxZ = storage.getMaxZIndex(eraId);
      const item: BoardItem = {
        id: crypto.randomUUID(),
        eraId,
        type: "image",
        x,
        y,
        width: 280,
        height: 280,
        rotation: Math.random() * 6 - 3,
        zIndex: maxZ + 1,
        imageUrl,
        createdAt: Date.now(),
      };
      storage.addItem(item);
      setItems((prev) => [...prev, item]);
      return item;
    },
    [eraId]
  );

  const updateItemPosition = useCallback(
    (id: string, x: number, y: number) => {
      setItems((prev) => {
        const updated = prev.map((i) => (i.id === id ? { ...i, x, y } : i));
        debouncedSave(updated);
        return updated;
      });
    },
    [debouncedSave]
  );

  const updateItemSize = useCallback(
    (id: string, width: number, height: number) => {
      setItems((prev) => {
        const updated = prev.map((i) =>
          i.id === id ? { ...i, width, height } : i
        );
        debouncedSave(updated);
        return updated;
      });
    },
    [debouncedSave]
  );

  const updateItemContent = useCallback(
    (id: string, updates: Partial<BoardItem>) => {
      setItems((prev) => {
        const updated = prev.map((i) =>
          i.id === id ? { ...i, ...updates } : i
        );
        debouncedSave(updated);
        return updated;
      });
    },
    [debouncedSave]
  );

  const bringToFront = useCallback(
    (id: string) => {
      if (!eraId) return;
      const maxZ = Math.max(...items.map((i) => i.zIndex), 0);
      setItems((prev) => {
        const updated = prev.map((i) =>
          i.id === id ? { ...i, zIndex: maxZ + 1 } : i
        );
        debouncedSave(updated);
        return updated;
      });
    },
    [eraId, items, debouncedSave]
  );

  const removeItem = useCallback(
    (id: string) => {
      storage.deleteItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    },
    []
  );

  return {
    items,
    addNote,
    addImage,
    addText,
    updateItemPosition,
    updateItemSize,
    updateItemContent,
    bringToFront,
    removeItem,
  };
}
