"use client";

interface TextPanelProps {
  onAddText: () => void;
}

export function TextPanel({ onAddText }: TextPanelProps) {
  return (
    <div className="w-[300px] min-w-[300px] h-full flex flex-col bg-card/90 backdrop-blur-xl border-r border-border shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] z-10 shrink-0 transition-colors">
      <div className="px-6 py-5 flex items-center justify-between border-b border-border">
        <h2 className="text-[13px] font-bold text-foreground/80 tracking-wider uppercase">Text</h2>
      </div>
      
      <div className="flex-1 flex flex-col p-5 gap-4">
        <button
          onClick={onAddText}
          className="w-full py-4 px-4 rounded-xl text-foreground bg-muted font-bold text-sm hover:bg-muted/80 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
        >
          Add Text Block
        </button>

        <div className="text-xs text-slate-500 text-center px-4 mt-2">
          Add freeform transparent text to your board.
        </div>
      </div>
    </div>
  );
}
