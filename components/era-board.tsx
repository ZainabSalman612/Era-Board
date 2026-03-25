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
      
      // Wait a bit to ensure UI updates finish
      await new Promise(resolve => setTimeout(resolve, 200));

      const innerDiv = canvasContainerRef.current.querySelector('div') as HTMLElement;
      if (!innerDiv) throw new Error("Canvas content missing");

      // Calculate the actual bounding box of items so we don't crash rendering a blank 4000x4000 canvas
      let minX = 4000, minY = 4000, maxX = 0, maxY = 0;
      if (items.length > 0) {
        items.forEach(item => {
          if (item.x < minX) minX = item.x;
          if (item.y < minY) minY = item.y;
          if (item.x + item.width > maxX) maxX = item.x + item.width;
          if (item.y + item.height > maxY) maxY = item.y + item.height;
        });
      } else {
        minX = 0; minY = 0; maxX = 1200; maxY = 800; // default for empty board
      }

      // Add 100px padding
      minX = Math.max(0, minX - 100);
      minY = Math.max(0, minY - 100);
      maxX = Math.min(4000, maxX + 100);
      maxY = Math.min(4000, maxY + 100);

      const exportWidth = maxX - minX;
      const exportHeight = maxY - minY;

      const dataUrl = await htmlToImage.toJpeg(innerDiv, {
        quality: 0.95,
        width: exportWidth,
        height: exportHeight,
        style: {
          transform: `translate(${-minX}px, ${-minY}px)`,
          // Use CSS variable fallback
          backgroundColor: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#111a22' : '#f1f1f1'
        }
      });

      const link = document.createElement('a');
      link.download = `${activeEra.name} Era Board.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
      alert("Failed to export image! Please ensure all images are fully loaded.");
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
