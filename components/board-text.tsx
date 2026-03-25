"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { GripVertical, X } from "lucide-react";
import { BoardItem } from "@/lib/types";

interface BoardTextProps {
  item: BoardItem;
  isSelected: boolean;
  onSelect: () => void;
  onPositionChange: (x: number, y: number) => void;
  onSizeChange: (width: number, height: number) => void;
  onContentChange: (updates: Partial<BoardItem>) => void;
  onDelete: () => void;
  onBringToFront: () => void;
}

export function BoardText({
  item,
  isSelected,
  onSelect,
  onPositionChange,
  onSizeChange,
  onContentChange,
  onDelete,
  onBringToFront,
}: BoardTextProps) {
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef({ width: item.width, height: item.height, x: 0, y: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height to fit content, up to the container's height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [item.content]);

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
        const newW = Math.max(100, resizeStartRef.current.width + dx);
        const newH = Math.max(40, resizeStartRef.current.height + dy);
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
      whileDrag={{ scale: 1.02, cursor: "grabbing" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {isSelected && (
        <div
          className="absolute -top-[46px] left-0 flex items-center gap-4 bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-black/[0.04] z-50 cursor-default"
          onPointerDown={(e) => e.stopPropagation()}
        >
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
        className={`w-full h-full flex flex-col relative transition-all duration-300 ${
          isSelected ? "ring-2 ring-[#6b95ab]/30 bg-white/50 backdrop-blur-md rounded-2xl shadow-[0_20px_40px_rgb(0,0,0,0.05)] border border-black/[0.02]" : "hover:ring-1 hover:ring-black/[0.05] hover:bg-white/40 rounded-2xl"
        }`}
      >
        {/* Drag handle & Delete */}
        <div
          className={`absolute -top-3 left-0 right-0 flex items-center justify-between px-2 opacity-0 transition-opacity ${
            isSelected || isResizing ? "opacity-100" : "group-hover:opacity-100"
          }`}
        >
          <div className="bg-white rounded-md shadow-sm border border-border px-1 py-0.5 cursor-grab active:cursor-grabbing">
            <GripVertical className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-5 h-5 bg-white rounded-full shadow-sm border border-border flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors z-10"
          >
            <X className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <textarea
          ref={textareaRef}
          value={item.content || ""}
          onChange={(e) => onContentChange({ content: e.target.value })}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-full h-full bg-transparent border-none outline-none resize-none px-3 py-2 font-medium placeholder:opacity-50 overflow-hidden leading-snug"
          placeholder="Double click to edit..."
          style={{
            fontSize: "1.25rem",
            color: item.textColor || "#1e293b",
          }}
        />

        {/* Resize handle */}
        <div
          onPointerDown={handleResizeStart}
          className={`absolute bottom-0 right-0 w-4 h-4 cursor-se-resize transition-opacity flex justify-end items-end p-0.5 opacity-0 ${
            isSelected || isResizing ? "opacity-100" : "group-hover:opacity-100"
          }`}
        >
          <svg viewBox="0 0 20 20" className="w-3 h-3 text-slate-400">
            <path
              d="M14 20L20 14M10 20L20 10M6 20L20 6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
