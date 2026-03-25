"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImagePlus, Upload } from "lucide-react";

interface ImageUploadProps {
  open: boolean;
  onClose: () => void;
  onUpload: (imageUrl: string) => void;
}

export function ImageUpload({ open, onClose, onUpload }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
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
      onClose();
    }
  };

  const handleClose = () => {
    setPreview(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImagePlus className="w-5 h-5 text-pink-400" />
            Add Image
          </DialogTitle>
        </DialogHeader>

        <div className="py-3">
          {preview ? (
            <div className="relative rounded-xl overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-[300px] object-contain bg-muted"
              />
              <button
                onClick={() => setPreview(null)}
                className="absolute top-2 right-2 px-3 py-1 rounded-full bg-black/50 text-white text-xs hover:bg-black/70 transition"
              >
                Remove
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 py-12 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                isDragging
                  ? "border-pink-400 bg-pink-50"
                  : "border-border hover:border-pink-300 hover:bg-pink-50/50"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                <Upload className="w-6 h-6 text-pink-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground/80">
                  Drop an image here or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, WEBP up to 10MB
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

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={!preview}
            onClick={handleSubmit}
            className="bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500"
          >
            Add to Board
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
