"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { X, GripVertical } from "lucide-react";
import { BoardItem } from "@/lib/types";

interface StickyNoteProps {
  item: BoardItem;
  isSelected: boolean;
  onSelect: () => void;
  onPositionChange: (x: number, y: number) => void;
  onSizeChange: (width: number, height: number) => void;
  onContentChange: (updates: Partial<BoardItem>) => void;
  onDelete: () => void;
  onBringToFront: () => void;
}

export function StickyNote({
  item,
  isSelected,
  onSelect,
  onPositionChange,
  onSizeChange,
  onContentChange,
  onDelete,
  onBringToFront,
}: StickyNoteProps) {
  const constraintsRef = useRef<HTMLElement | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef({ width: item.width, height: item.height, x: 0, y: 0 });

  const handleResizeStart = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      resizeStartRef.current = {
        width: item.width,
        height: item.height,
        x: e.clientX,
        y: e.clientY,
      };

      const handleMove = (ev: PointerEvent) => {
        const dx = ev.clientX - resizeStartRef.current.x;
        const dy = ev.clientY - resizeStartRef.current.y;
        const newW = Math.max(160, resizeStartRef.current.width + dx);
        const newH = Math.max(120, resizeStartRef.current.height + dy);
        onSizeChange(newW, newH);
      };

      const handleUp = () => {
        setIsResizing(false);
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [item.width, item.height, onSizeChange]
  );

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragStart={() => {
        onBringToFront();
        onSelect();
      }}
      onDragEnd={(_, info) => {
        onPositionChange(item.x + info.offset.x, item.y + info.offset.y);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect();
        onBringToFront();
      }}
      className="absolute group touch-none"
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        zIndex: item.zIndex,
        rotate: `${item.rotation}deg`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileDrag={{ scale: 1.04, cursor: "grabbing" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {isSelected && (
        <div
          className="absolute -top-[46px] left-0 flex items-center gap-4 bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-black/[0.04] z-50 cursor-default"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* Background Color */}
          <div className="flex items-center gap-2 border-r border-border pr-4">
            <span className="text-[10px] font-bold text-muted-foreground tracking-wider">BG</span>
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-black/20 shadow-sm hover:scale-110 transition-transform">
              <input
                type="color"
                value={item.noteColor || "#f4f0e4"}
                onChange={(e) => onContentChange({ noteColor: e.target.value })}
                className="absolute -inset-2 w-10 h-10 cursor-pointer outline-none"
                title="Choose background color"
              />
            </div>
          </div>
          {/* Text Color */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground tracking-wider">TEXT</span>
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-black/20 shadow-sm hover:scale-110 transition-transform">
              <input
                type="color"
                value={item.textColor || "#1e293b"}
                onChange={(e) => onContentChange({ textColor: e.target.value })}
                className="absolute -inset-2 w-10 h-10 cursor-pointer outline-none"
                title="Choose text color"
              />
            </div>
          </div>
        </div>
      )}

      <div
        className={`w-full h-full rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col overflow-hidden transition-shadow duration-300 border border-black/[0.02] ${
          isSelected ? "ring-2 ring-[#6b95ab]/40 shadow-[0_20px_40px_rgb(0,0,0,0.08)]" : "hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
        }`}
        style={{ backgroundColor: item.noteColor || "#fef3c7" }}
      >
        {/* Header with drag handle */}
        <div className="flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing">
          <GripVertical className="w-3.5 h-3.5 text-black/20" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/10 transition-all"
          >
            <X className="w-3 h-3 text-black/40" />
          </button>
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder="Title..."
          value={item.title || ""}
          onChange={(e) => onContentChange({ title: e.target.value })}
          onPointerDown={(e) => e.stopPropagation()}
          className="px-3 pb-1 text-sm font-semibold bg-transparent border-none outline-none placeholder-inherit"
          style={{ color: item.textColor || "#1e293b" }}
        />

        {/* Content */}
        <textarea
          placeholder="Write something..."
          value={item.content || ""}
          onChange={(e) => onContentChange({ content: e.target.value })}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex-1 px-3 py-1 text-xs bg-transparent border-none outline-none resize-none placeholder-inherit leading-relaxed"
          style={{ color: item.textColor || "#1e293b" }}
        />

        {/* Resize handle */}
        <div
          onPointerDown={handleResizeStart}
          className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg viewBox="0 0 20 20" className="w-full h-full text-black/20">
            <path
              d="M14 20L20 14M10 20L20 10M6 20L20 6"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
