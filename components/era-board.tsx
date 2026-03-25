"use client";

import { useState, useRef } from "react";
import * as htmlToImage from "html-to-image";
import { useEras } from "@/hooks/use-eras";
import { useBoard } from "@/hooks/use-board";
import { EraSidebar } from "@/components/era-sidebar";
import { Canvas } from "@/components/canvas";
import { TopBar } from "@/components/top-bar";
import { PrimarySidebar } from "@/components/primary-sidebar";
import { NotesPanel } from "@/components/notes-panel";
import { ImagePanel } from "@/components/image-panel";
import { TextPanel } from "@/components/text-panel";

export function EraBoard() {
  const {
    eras,
    activeEra,
    activeEraId,
    setActiveEraId,
    createEra,
    renameEra,
    changeEraColor,
    removeEra,
  } = useEras();

  const {
    items,
    addNote,
    addImage,
    addText,
    updateItemPosition,
    updateItemSize,
    updateItemContent,
    bringToFront,
    removeItem,
  } = useBoard(activeEraId);

  const [activeTab, setActiveTab] = useState<"eras" | "notes" | "images" | "text">("eras");
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!canvasContainerRef.current || !activeEra) return;
    
    try {
      setIsDownloading(true);
      
      // Wait a bit to ensure UI updates finish (like deselecting in Canvas, if any)
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await htmlToImage.toPng(canvasContainerRef.current, {
        quality: 0.9,
        backgroundColor: '#f4f0e4', // exact cream background
        width: Math.min(window.innerWidth - 352, 1920), // Exclude sidebars
        height: Math.min(window.innerHeight - 56, 1080), // Exclude top bar
        style: {
          transform: 'none',
        }
      });

      const link = document.createElement('a');
      link.download = `${activeEra.name.replace(/\s+/g, '-').toLowerCase()}-board.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAddNote = () => {
    const x = 200 + Math.random() * 400;
    const y = 150 + Math.random() * 300;
    addNote(x, y);
  };

  const handleAddImage = (imageUrl: string) => {
    const x = 250 + Math.random() * 350;
    const y = 100 + Math.random() * 300;
    addImage(imageUrl, x, y);
  };

  const handleAddText = () => {
    const x = 200 + Math.random() * 400;
    const y = 150 + Math.random() * 300;
    addText(x, y);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground">
      <TopBar 
        activeEra={activeEra} 
        itemsCount={items.length} 
        onDownload={handleDownload}
        isDownloading={isDownloading}
      />
      <div className="flex flex-1 overflow-hidden">
        <PrimarySidebar activeTab={activeTab} onChangeTab={setActiveTab} />
        
        {/* Render the correct secondary panel */}
        {activeTab === "eras" && (
          <EraSidebar
            eras={eras}
            activeEraId={activeEraId}
            onSelectEra={setActiveEraId}
            onCreateEra={createEra}
            onRenameEra={renameEra}
            onDeleteEra={removeEra}
            onChangeColor={changeEraColor}
          />
        )}
        {activeTab === "notes" && (
          <NotesPanel onAddNote={handleAddNote} />
        )}
        {activeTab === "images" && (
          <ImagePanel 
            onUpload={handleAddImage} 
            currentImageCount={items.filter(i => i.type === "image").length}
          />
        )}
        {activeTab === "text" && (
          <TextPanel onAddText={handleAddText} />
        )}

        <Canvas
          items={items}
          activeEraName={activeEra?.name || null}
          activeEraColor={activeEra?.color || null}
          onAddNote={handleAddNote}
          onAddImage={handleAddImage}
          onUpdatePosition={updateItemPosition}
          onUpdateSize={updateItemSize}
          onUpdateContent={updateItemContent}
          onBringToFront={bringToFront}
          onDeleteItem={removeItem}
          containerRef={canvasContainerRef}
        />
      </div>
    </div>
  );
}
