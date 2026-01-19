"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Rnd } from "react-rnd";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Swal from "sweetalert2";
import PacmanLoader from "react-spinners/PacmanLoader";
import Image from "next/image";
import html2canvas from "html2canvas";

interface CollageEditorProps {
  initialImages: File[];
  onSave: (collageElement: HTMLElement) => void;
  onCancel: () => void;
}

const CollageEditor: React.FC<CollageEditorProps> = ({
  initialImages,
  onSave,
  onCancel,
}) => {
  const [images, setImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [containerSize, setContainerSize] = useState({
    width: 500,
    height: 700,
  });
  const [isExporting, setIsExporting] = useState(false);

  // Initialize images from props
  useEffect(() => {
    const imageObjects = initialImages.map((file, index) => ({
      id: Date.now() + index,
      url: URL.createObjectURL(file),
      x: index * 30,
      y: index * 30,
      width: 180,
      height: 180,
    }));
    setImages(imageObjects);

    return () => {
      imageObjects.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [initialImages]);

  // Handle Container Responsive Sizing (A4 Ratio)
  useEffect(() => {
    const updateContainerSize = () => {
      const width = window.innerWidth < 600 ? window.innerWidth - 60 : 450;
      const height = (width * 297) / 210; // Accurate A4 Aspect Ratio
      setContainerSize({ width, height });
    };
    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, []);

  const handleDragResize = (id: number, data: any) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...data } : img)),
    );
  };

  const handleAlignImages = () => {
    const margin = 15;
    const { width, height } = containerSize;
    const num = images.length;
    if (num < 1) return;

    const cols = Math.ceil(Math.sqrt(num));
    const rows = Math.ceil(num / cols);
    const cellW = (width - (cols + 1) * margin) / cols;
    const cellH = (height - (rows + 1) * margin) / rows;

    const layout = images.map((_, i) => ({
      x: margin + (i % cols) * (cellW + margin),
      y: margin + Math.floor(i / cols) * (cellH + margin),
      width: cellW,
      height: cellH,
    }));
    setImages(images.map((img, i) => ({ ...img, ...layout[i] })));
  };

  const handleExportCollage = async () => {
    const collageElement = document.getElementById("collage-container");
    if (!collageElement || images.length === 0) {
      Swal.fire("Wait!", "Add some photos to the canvas first!", "warning");
      return;
    }

    setIsExporting(true);
    setSelectedImage(null); // Deselect to hide UI borders in export

    try {
      // Small delay to ensure state update for deselection is rendered
      await new Promise((resolve) => setTimeout(resolve, 100));

      // We pass the element to MyPrints/Start handleCollageSave
      // which should now be using: backgroundColor: "#ffffff" in html2canvas
      await onSave(collageElement);
    } catch (error) {
      Swal.fire("Error", "Collage cook-off failed. Try again!", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleAddMore = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newImgs = files.map((f, i) => ({
      id: Date.now() + i,
      url: URL.createObjectURL(f),
      x: 50,
      y: 50,
      width: 150,
      height: 150,
    }));
    setImages((prev) => [...prev, ...newImgs]);
  };

  // UI Button Style (High Visibility)
  const btnBase =
    "flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all duration-300 bg-brand-matte border border-white/10 shadow-[4px_4px_10px_rgba(0,0,0,0.5),-1px_-1px_10px_rgba(255,255,255,0.02)] active:shadow-neu-in active:scale-95";

  return (
    <div className="w-full max-w-4xl flex flex-col items-center p-5 md:p-10 bg-[#121214] rounded-[3rem] shadow-neu-out border border-white/5 antialiased transform-gpu">
      {/* Tool Header */}
      <div className="w-full flex justify-between items-start mb-8 px-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white leading-none mb-2">
            Print{" "}
            <span className="text-brand-cyan drop-shadow-glow-cyan">
              Canvas
            </span>
          </h2>
          <div className="inline-flex items-center gap-2 bg-brand-matte shadow-neu-in px-3 py-1 rounded-full border border-white/5">
            <div className="w-1 h-1 bg-brand-cyan rounded-full animate-pulse shadow-glow-cyan" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">
              A4 Ratio • White Background
            </span>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="w-10 h-10 rounded-full bg-brand-matte shadow-neu-out border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all"
        >
          <CloseIcon fontSize="small" />
        </button>
      </div>

      {/* Main Canvas Area: The White Paper */}
      <div className="relative w-full flex justify-center py-6 bg-black/30 rounded-[2.5rem] shadow-neu-in mb-8 overflow-hidden">
        <div
          id="collage-container"
          className="relative bg-white shadow-2xl rounded-sm overflow-hidden transition-all"
          style={{
            width: containerSize.width,
            height: containerSize.height,
          }}
        >
          {images.map((image) => (
            <Rnd
              key={image.id}
              size={{ width: image.width, height: image.height }}
              position={{ x: image.x, y: image.y }}
              bounds="parent"
              onDragStop={(e, d) =>
                handleDragResize(image.id, { x: d.x, y: d.y })
              }
              onResizeStop={(e, direction, ref, delta, position) =>
                handleDragResize(image.id, {
                  width: ref.offsetWidth,
                  height: ref.offsetHeight,
                  x: position.x,
                  y: position.y,
                })
              }
              onClick={() => setSelectedImage(image.id)}
              style={{ zIndex: selectedImage === image.id ? 10 : 1 }}
            >
              <div
                className={`w-full h-full p-0.5 bg-white transition-all duration-300 ${
                  selectedImage === image.id
                    ? "ring-4 ring-brand-cyan shadow-2xl scale-[1.01]"
                    : "shadow-sm grayscale-[0.1]"
                }`}
              >
                <Image
                  src={image.url}
                  alt="collage item"
                  fill
                  className="object-cover pointer-events-none"
                />
              </div>
            </Rnd>
          ))}
        </div>
      </div>

      {/* Global Loader */}
      {isExporting && (
        <div className="fixed inset-0 z-[200] flex justify-center items-center flex-col bg-brand-matte/95 backdrop-blur-md">
          <PacmanLoader color="#22d3ee" loading={isExporting} size={40} />
          <p className="text-brand-cyan font-black mt-10 uppercase tracking-[0.4em] animate-pulse text-[10px]">
            Generating High-Res PDF...
          </p>
        </div>
      )}

      {/* Toolbar */}
      <div className="w-full flex flex-col sm:flex-row gap-5 px-2">
        <div className="flex flex-1 gap-4">
          <button
            onClick={() => document.getElementById("add-more-collage")?.click()}
            className={`${btnBase} flex-1 text-gray-300 md:hover:text-brand-cyan`}
          >
            <AddIcon fontSize="small" /> Photo
          </button>

          <button
            onClick={handleAlignImages}
            className={`${btnBase} flex-1 text-gray-300 md:hover:text-brand-purple`}
          >
            <AutoAwesomeIcon fontSize="small" /> Snap
          </button>

          <input
            id="add-more-collage"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleAddMore}
          />
        </div>

        <div className="flex flex-1 gap-4">
          {selectedImage !== null && (
            <button
              onClick={() => {
                setImages(images.filter((i) => i.id !== selectedImage));
                setSelectedImage(null);
              }}
              className={`${btnBase} flex-1 text-red-400/80 border-red-500/20`}
            >
              <DeleteIcon fontSize="small" /> Scrap
            </button>
          )}

          <button
            onClick={handleExportCollage}
            className={`${btnBase} flex-1 text-brand-cyan border-brand-cyan/30 shadow-[0_0_20px_rgba(34,211,238,0.15)]`}
          >
            <CheckCircleIcon fontSize="small" /> Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollageEditor;
