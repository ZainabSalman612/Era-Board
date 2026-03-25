"use client";

import { useState, useEffect, useCallback } from "react";
import { Era, ERA_COLORS } from "@/lib/types";
import * as storage from "@/lib/storage";

export function useEras() {
  const [eras, setEras] = useState<Era[]>([]);
  const [activeEraId, setActiveEraId] = useState<string | null>(null);

  useEffect(() => {
    const loaded = storage.getEras();
    setEras(loaded);
    if (loaded.length > 0) {
      setActiveEraId(loaded[0].id);
    }
  }, []);

  const activeEra = eras.find((e) => e.id === activeEraId) || null;

  const createEra = useCallback(
    (name: string) => {
      const color = ERA_COLORS[eras.length % ERA_COLORS.length];
      const era = storage.createEra(name, color);
      setEras((prev) => [...prev, era]);
      setActiveEraId(era.id);
      return era;
    },
    [eras.length]
  );

  const renameEra = useCallback((id: string, name: string) => {
    const updated = storage.updateEra(id, { name });
    setEras(updated);
  }, []);

  const changeEraColor = useCallback((id: string, color: string) => {
    const updated = storage.updateEra(id, { color });
    setEras(updated);
  }, []);

  const removeEra = useCallback(
    (id: string) => {
      const updated = storage.deleteEra(id);
      setEras(updated);
      if (activeEraId === id) {
        setActiveEraId(updated.length > 0 ? updated[0].id : null);
      }
    },
    [activeEraId]
  );

  return {
    eras,
    activeEra,
    activeEraId,
    setActiveEraId,
    createEra,
    renameEra,
    changeEraColor,
    removeEra,
  };
}
