"use client";

import React, { useState, useCallback, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import { FileUpload } from "@/components/ui/FileUpload";
import { useRouter } from "next/navigation";
import useFileStore from "@/store/filesStore";
import PacmanLoader from "react-spinners/PacmanLoader";
import CollageEditor from "../collageEditor/CollageEditor";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Start = () => {
  const [fileData, setFileData] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCollageEditorOpen, setIsCollageEditorOpen] = useState(false);
  const [collageImages, setCollageImages] = useState<File[]>([]);
  const router = useRouter();
  const store = useFileStore();
  const collageInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: File[]) => {
    const existingFiles = new Set(
      store.filesWithConfigs.map((item) => item.file.name),
    );
    const newFiles = files.filter((file) => !existingFiles.has(file.name));

    if (newFiles.length === 0) {
      Swal.fire({
        title: "Whoops!",
        text: "These files are already in the system.",
        icon: "warning",
        confirmButtonColor: "#9D5CFF",
      });
      return;
    }

    setFileData((prev) => [...prev, ...newFiles]);
    newFiles.forEach((file) => {
      store.addFile(file, {
        color: "b&w",
        orientation: "portrait",
        pagesToPrint: "all",
        sided: "single",
        copies: 1,
        remarks: "",
        specificRange: "",
        totalPrice: 0,
        pageSize: 0,
        configured: false,
        pageType: "A4",
      });
    });

    setLoading(true);
    await Swal.fire({
      title: "LIT!",
      text: "Files Uploaded Successfully",
      icon: "success",
      confirmButtonColor: "#73EFD1",
    });
    router.push("/new-order");
  };

  const handleCollageUpload = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) =>
      file.type.startsWith("image/"),
    );
    if (validFiles.length === 0) {
      Swal.fire("Error", "JPG/PNG only, chief!", "error");
      return;
    }
    setCollageImages(validFiles);
    setIsCollageEditorOpen(true);
  };

  const handleCollageSave = useCallback(
    async (collageElement: HTMLElement) => {
      setLoading(true);
      try {
        const canvas = await html2canvas(collageElement, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        // Initialize PDF (A4 size)
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth(); // 210
        const pdfHeight = pdf.internal.pageSize.getHeight(); // 297

        // Calculate ratios
        const imgProps = pdf.getImageProperties(imgData);
        const ratio = imgProps.width / imgProps.height;

        // Calculate scaled height based on the PDF width
        let finalImgWidth = pdfWidth;
        let finalImgHeight = pdfWidth / ratio;

        // FIX: If the calculated height is taller than A4, scale it down to fit the height instead
        if (finalImgHeight > pdfHeight) {
          finalImgHeight = pdfHeight;
          finalImgWidth = pdfHeight * ratio;
        }

        // Center the image on the PDF page
        const xOffset = (pdfWidth - finalImgWidth) / 2;
        const yOffset = (pdfHeight - finalImgHeight) / 2;

        pdf.addImage(
          imgData,
          "PNG",
          xOffset,
          yOffset,
          finalImgWidth,
          finalImgHeight,
        );

        // Save the PDF as a File object
        const file = new File([pdf.output("blob")], "collage.pdf", {
          type: "application/pdf",
        });

        setFileData((prevData) => [...prevData, file]);
        store.addFile(file, {
          color: "b&w",
          orientation: "portrait",
          pagesToPrint: "all",
          sided: "single",
          copies: 1,
          remarks: "",
          specificRange: "",
          totalPrice: 0,
          pageSize: 0,
          configured: false,
          pageType: "A4",
        });

        setIsCollageEditorOpen(false);
        router.push("/new-order");
      } catch (error) {
        Swal.fire("Error", "Failed to cook that collage.", "error");
      } finally {
        setLoading(false);
      }
    },
    [router, store],
  );

  return (
    <div className="min-h-screen bg-brand-matte py-12 px-4 antialiased transform-gpu">
      {/* Loading State: Performance-focused overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center flex-col bg-brand-matte/90 backdrop-blur-md">
          <PacmanLoader color="#22d3ee" loading={loading} size={40} />
          <p className="text-brand-cyan font-black mt-10 uppercase tracking-[0.4em] animate-pulse text-[10px]">
            Compiling your documents...
          </p>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Main Interface: Neumorphic Elevated Container */}
        <div className="bg-brand-matte shadow-neu-out rounded-[2.5rem] border border-white/5 overflow-hidden">
          {/* Header Bar: Integrated Matte Style */}
          <div className="p-8 pb-4 text-center">
            <div className="inline-flex items-center gap-2 bg-brand-matte shadow-neu-in px-4 py-1.5 rounded-full mb-6 border border-white/5">
              <div className="w-1.5 h-1.5 bg-brand-purple rounded-full shadow-glow-purple" />
              <span className="text-gray-500 font-black text-[9px] uppercase tracking-[0.3em]">
                Secure Input Terminal
              </span>
            </div>
            <h1 className="text-white text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
              Quick{" "}
              <span className="text-brand-cyan drop-shadow-glow-cyan">
                Print
              </span>
            </h1>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-3">
              Upload assignments or design collages
            </p>
          </div>

          <div className="p-8 pt-4">
            {!loading && fileData.length === 0 && (
              <div className="flex flex-col gap-10">
                {/* File Upload Area: Recessed "Drop Slot" */}
                <div className="relative p-2 bg-brand-matte shadow-neu-in rounded-[2rem] border border-white/5 group transition-all duration-300">
                  <div className="p-4 rounded-[1.5rem] border-2 border-dashed border-white/10 group-hover:border-brand-cyan transition-colors">
                    <FileUpload onChange={handleFileUpload} />
                  </div>
                </div>

                {/* Separator: Neumorphic Inset Line */}
                <div className="flex items-center gap-6">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <span className="font-black text-gray-600 uppercase text-[10px] tracking-widest">
                    Manual Tooling
                  </span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                {/* Collage Button: Tactile Elevated Switch */}
                <button
                  onClick={() => collageInputRef.current?.click()}
                  className="group relative w-full py-6 bg-brand-matte rounded-2xl shadow-neu-out md:hover:shadow-neu-in active:scale-95 transition-all duration-300 flex items-center justify-center gap-4 overflow-hidden border border-white/5"
                >
                  <div className="w-10 h-10 bg-brand-matte shadow-neu-in rounded-xl flex items-center justify-center text-brand-purple group-hover:shadow-glow-purple transition-all">
                    <AddIcon fontSize="small" />
                  </div>
                  <span className="text-white font-black uppercase text-lg italic tracking-tight">
                    Photo Collage{" "}
                    <span className="text-brand-purple underline decoration-brand-purple/30 underline-offset-4">
                      Cooker
                    </span>
                  </span>
                  <input
                    ref={collageInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    onChange={(e) =>
                      handleCollageUpload(Array.from(e.target.files!))
                    }
                    className="hidden"
                  />
                </button>
              </div>
            )}

            {/* Empty State Message: Soft Neumorphic Inset */}
            {!loading && fileData.length === 0 && (
              <div className="mt-12 p-6 bg-brand-matte shadow-neu-in rounded-2xl text-center border border-white/5">
                <p className="text-gray-500 font-black uppercase text-[10px] tracking-[0.1em]">
                  Ready for your next submission. No prints in queue.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collage Editor Modal: High-End Console Look */}
      {isCollageEditorOpen && (
        <div className="fixed inset-0 bg-brand-matte/95 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
          <div className="bg-brand-matte shadow-neu-out p-6 rounded-[2.5rem] max-w-5xl w-full border border-white/10">
            <div className="flex justify-between items-center mb-6 px-4">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                Collage <span className="text-brand-cyan">Workshop</span>
              </h2>
              <div className="w-8 h-8 rounded-full shadow-neu-in flex items-center justify-center">
                <div className="w-2 h-2 bg-brand-cyan rounded-full shadow-glow-cyan animate-pulse" />
              </div>
            </div>
            <div className="shadow-neu-in rounded-3xl p-4 bg-black/20">
              <CollageEditor
                initialImages={collageImages}
                onSave={handleCollageSave}
                onCancel={() => setIsCollageEditorOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Start;
