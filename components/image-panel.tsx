"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";

interface ImagePanelProps {
  onUpload: (imageUrl: string) => void;
  currentImageCount: number;
}

export function ImagePanel({ onUpload, currentImageCount }: ImagePanelProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    if (currentImageCount >= 10) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      
      const MAX_SIZE = 800;
      if (width > MAX_SIZE || height > MAX_SIZE) {
        if (width > height) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Compress JPEG to save massive amounts of localStorage space
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setPreview(compressedDataUrl);
      }
    };

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = () => {
    if (preview) {
      onUpload(preview);
      setPreview(null);
    }
  };

  const isAtLimit = currentImageCount >= 10;

  return (
    <div className="w-[300px] min-w-[300px] h-full flex flex-col bg-card/90 backdrop-blur-xl border-r border-border shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] z-10 shrink-0 transition-colors">
      <div className="px-6 py-5 flex flex-col gap-1 border-b border-border">
        <h2 className="text-[13px] font-bold text-foreground/80 tracking-wider uppercase">Images</h2>
        <span className="text-[10px] font-medium text-muted-foreground">{currentImageCount} / 10 used</span>
      </div>

      <div className="flex-1 flex flex-col p-5">
        {preview ? (
          <div className="flex flex-col gap-4">
            <div className="relative rounded-xl overflow-hidden border border-border shadow-sm">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-[220px] object-contain bg-white"
              />
              <button
                onClick={() => setPreview(null)}
                className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/60 text-white text-[10px] hover:bg-black/80 transition"
              >
                Remove
              </button>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-xl bg-[#6b95ab] text-white text-sm font-bold hover:bg-[#5b8397] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm shadow-[#6b95ab]/20"
            >
              Add to Board
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (!isAtLimit) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              if (isAtLimit) return;
              handleDrop(e);
            }}
            onClick={() => {
              if (!isAtLimit) inputRef.current?.click();
            }}
            className={`flex flex-col items-center justify-center gap-3 py-12 rounded-2xl border-2 border-dashed transition-all ${
              isAtLimit ? "opacity-50 cursor-not-allowed border-border bg-muted/20" : "cursor-pointer"
            } ${
              isDragging && !isAtLimit
                ? "border-primary bg-primary/5"
                : !isAtLimit ? "border-border hover:border-primary/50 hover:bg-primary/5" : ""
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isAtLimit ? 'bg-muted/50' : 'bg-muted'}`}>
              <Upload className={`w-5 h-5 ${isAtLimit ? 'text-muted-foreground/50' : 'text-muted-foreground'}`} />
            </div>
            <div className="text-center px-4">
              <p className={`text-xs font-semibold ${isAtLimit ? 'text-foreground/50' : 'text-foreground/80'}`}>
                {isAtLimit ? "Limit Reached" : "Click or Drop"}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                PNG, JPG (Max 10MB)
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
