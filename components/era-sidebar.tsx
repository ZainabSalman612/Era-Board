"use client";

import { useState } from "react";
import { Era, ERA_COLORS } from "@/lib/types";
import { Plus, Pencil, Palette } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";

interface EraSidebarProps {
  eras: Era[];
  activeEraId: string | null;
  onSelectEra: (id: string) => void;
  onCreateEra: (name: string) => void;
  onRenameEra: (id: string, name: string) => void;
  onDeleteEra: (id: string) => void;
  onChangeColor: (id: string, color: string) => void;
}

export function EraSidebar({
  eras,
  activeEraId,
  onSelectEra,
  onCreateEra,
  onRenameEra,
  onDeleteEra,
  onChangeColor,
}: EraSidebarProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleCreate = () => {
    if (newName.trim()) {
      onCreateEra(newName.trim());
      setNewName("");
      setShowCreate(false);
    }
  };

  const handleRename = () => {
    if (editingId && editName.trim()) {
      onRenameEra(editingId, editName.trim());
      setEditingId(null);
      setEditName("");
    }
  };

  return (
    <div className="w-[300px] min-w-[300px] h-full flex flex-col bg-card/90 backdrop-blur-xl border-r border-border shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] z-10 shrink-0 transition-colors">
      {/* Panel Header */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-border">
        <h2 className="text-[13px] font-bold text-foreground/80 tracking-wider uppercase">Eras</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="text-xs font-bold text-[#6b95ab] hover:text-[#5b8397] transition-colors"
        >
          + New
        </button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <AnimatePresence mode="popLayout">
          {eras.map((era) => (
            <motion.div
              key={era.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              layout
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectEra(era.id);
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-300 group border-b border-border/50 last:border-0 ${
                      activeEraId === era.id
                        ? "bg-muted shadow-sm relative overflow-hidden"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    {activeEraId === era.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6b95ab] shadow-[0_0_8px_rgba(107,149,171,0.5)]" />
                    )}
                    <div
                      className="w-3 h-3 rounded-full shrink-0 shadow-sm ring-2 ring-white/50"
                      style={{ backgroundColor: era.color }}
                    />
                    <span
                      className={`text-[13px] tracking-wide truncate flex-1 ${
                        activeEraId === era.id
                          ? "font-bold text-primary"
                          : "font-semibold text-muted-foreground group-hover:text-foreground/80"
                      }`}
                    >
                      {era.name}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-muted-foreground">•••</span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => {
                      setEditingId(era.id);
                      setEditName(era.name);
                    }}
                    className="text-xs"
                  >
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="text-xs">
                      Color
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <div className="grid grid-cols-4 gap-1.5 p-2">
                        {ERA_COLORS.map((color) => (
                          <button
                            key={color}
                            className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ring-2 ${
                              era.color === color
                                ? "ring-foreground/50 scale-110"
                                : "ring-transparent"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => onChangeColor(era.id, color)}
                          />
                        ))}
                      </div>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDeleteEra(era.id)}
                    className="text-xs text-destructive focus:text-destructive"
                  >
                    Delete Era
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          ))}
        </AnimatePresence>

        {eras.length === 0 && (
          <div className="text-center py-10 px-4">
            <div className="text-3xl mb-2">🌸</div>
            <p className="text-sm text-muted-foreground">
              No eras yet. Create your first one!
            </p>
          </div>
        )}
      </ScrollArea>

      {/* Create Button omitted from bottom, moved to header */}

      {/* Create Era Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Create New Era ✨</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <Input
              placeholder="e.g. Soft Girl Reset, Rich Auntie Energy..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Era Dialog */}
      <Dialog
        open={editingId !== null}
        onOpenChange={(open) => !open && setEditingId(null)}
      >
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Rename Era</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingId(null)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
