"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { BoardItem } from "@/lib/types";

interface BoardImageProps {
  item: BoardItem;
  isSelected: boolean;
  onSelect: () => void;
  onPositionChange: (x: number, y: number) => void;
  onSizeChange: (width: number, height: number) => void;
  onDelete: () => void;
  onBringToFront: () => void;
}

export function BoardImage({
  item,
  isSelected,
  onSelect,
  onPositionChange,
  onSizeChange,
  onDelete,
  onBringToFront,
}: BoardImageProps) {
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef({
    width: item.width,
    height: item.height,
    x: 0,
    y: 0,
  });

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
        const newH = Math.max(100, resizeStartRef.current.height + dy);
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
      {/* Photo frame effect */}
      <div
        className={`w-full h-full rounded-2xl bg-white p-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-black/[0.02] transition-shadow duration-300 ${
          isSelected
            ? "ring-2 ring-[#6b95ab]/40 shadow-[0_20px_40px_rgb(0,0,0,0.12)]"
            : "hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]"
        }`}
      >
        {/* Image */}
        <div className="w-full h-full rounded overflow-hidden bg-muted relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt=""
            className="w-full h-full object-cover pointer-events-none select-none"
            draggable={false}
          />
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all z-10"
        >
          <X className="w-3.5 h-3.5 text-red-400" />
        </button>

        {/* Resize handle */}
        <div
          onPointerDown={handleResizeStart}
          className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg viewBox="0 0 20 20" className="w-full h-full text-black/15">
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
