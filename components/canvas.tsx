"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { BoardItem } from "@/lib/types";
import { StickyNote } from "@/components/sticky-note";
import { BoardImage } from "@/components/board-image";
import { BoardText } from "@/components/board-text";

interface CanvasProps {
  items: BoardItem[];
  activeEraName: string | null;
  activeEraColor: string | null;
  onAddNote: (x: number, y: number) => void;
  onAddImage: (imageUrl: string, x: number, y: number) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onUpdateSize: (id: string, width: number, height: number) => void;
  onUpdateContent: (id: string, updates: Partial<BoardItem>) => void;
  onBringToFront: (id: string) => void;
  onDeleteItem: (id: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function Canvas({
  items,
  activeEraName,
  activeEraColor,
  onAddNote,
  onAddImage,
  onUpdatePosition,
  onUpdateSize,
  onUpdateContent,
  onBringToFront,
  onDeleteItem,
  containerRef,
}: CanvasProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleCanvasClick = useCallback(() => {
    setSelectedId(null);
  }, []);

  if (!activeEraName) {
    return (
      <div className="flex-1 flex items-center justify-center bg-canvas-bg">
        <div className="text-center">
          <div className="text-5xl mb-4">🌟</div>
          <h2 className="text-xl font-semibold text-foreground/60 mb-2">
            Welcome to Era Board
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Create your first era to start building your vision board
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Canvas area */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-auto canvas-grid"
        onPointerDown={handleCanvasClick}
      >
        {/* Canvas content area - large so items can be placed freely */}
        <div className="relative" style={{ width: "4000px", height: "4000px" }}>
          <AnimatePresence>
            {items.map((item) => {
              if (item.type === "note") {
                return (
                  <StickyNote
                    key={item.id}
                    item={item}
                    isSelected={selectedId === item.id}
                    onSelect={() => setSelectedId(item.id)}
                    onPositionChange={(x, y) => onUpdatePosition(item.id, x, y)}
                    onSizeChange={(w, h) => onUpdateSize(item.id, w, h)}
                    onContentChange={(updates) => onUpdateContent(item.id, updates)}
                    onDelete={() => onDeleteItem(item.id)}
                    onBringToFront={() => onBringToFront(item.id)}
                  />
                );
              }
              if (item.type === "image") {
                return (
                  <BoardImage
                    key={item.id}
                    item={item}
                    isSelected={selectedId === item.id}
                    onSelect={() => setSelectedId(item.id)}
                    onPositionChange={(x, y) => onUpdatePosition(item.id, x, y)}
                    onSizeChange={(w, h) => onUpdateSize(item.id, w, h)}
                    onDelete={() => onDeleteItem(item.id)}
                    onBringToFront={() => onBringToFront(item.id)}
                  />
                );
              }
              if (item.type === "text") {
                return (
                  <BoardText
                    key={item.id}
                    item={item}
                    isSelected={selectedId === item.id}
                    onSelect={() => setSelectedId(item.id)}
                    onPositionChange={(x, y) => onUpdatePosition(item.id, x, y)}
                    onSizeChange={(w, h) => onUpdateSize(item.id, w, h)}
                    onContentChange={(updates) => onUpdateContent(item.id, updates)}
                    onDelete={() => onDeleteItem(item.id)}
                    onBringToFront={() => onBringToFront(item.id)}
                  />
                );
              }
              return null;
            })}
          </AnimatePresence>

          {/* Empty state for current era */}
          {items.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <Sparkles className="w-10 h-10 text-pink-300 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground font-medium">
                  Start adding images and notes to this era
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Use the toolbar above to begin ✨
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
