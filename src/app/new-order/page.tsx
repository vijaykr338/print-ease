"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import CollageEditor from "../collageEditor/CollageEditor";
import PrintConfig from "../print-config/print-config";
import useFileStore from "@/store/filesStore";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PacmanLoader from "react-spinners/PacmanLoader";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Image from "next/image";

export default function MyPrints() {
  const store = useFileStore();
  const [fileData, setFileData] = useState<{ file: File; config: any }[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCollageEditorOpen, setIsCollageEditorOpen] = useState(false);
  const [collageImages, setCollageImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Your Logic: Syncing store to local state
  useEffect(() => {
    setFileData(store.filesWithConfigs);
  }, [store.filesWithConfigs]);

  // Your Logic: Memoizing configs
  const fileConfigs = useMemo(() => {
    return Object.fromEntries(
      fileData.map(({ file, config }) => [file.name, config]),
    );
  }, [fileData]);

  // Your Logic: File Upload
  const handleFileUpload = useCallback((newFiles: File[]) => {
    setFileData((prevFileData) => {
      const existingFilesSet = new Set(
        prevFileData.map((item) => item.file.name),
      );
      const duplicateFiles = newFiles.filter((file) =>
        existingFilesSet.has(file.name),
      );

      if (duplicateFiles.length > 0) {
        Swal.fire({
          title: "DUPLICATE!",
          text: `Already in the stack: ${duplicateFiles.map((f) => f.name).join(", ")}`,
          icon: "warning",
          confirmButtonColor: "#121214",
        });
        return prevFileData;
      }

      if (prevFileData.length + newFiles.length > 3) {
        Swal.fire({
          title: "LIMIT REACHED",
          text: "You can upload a maximum of 3 files.",
          icon: "error",
          confirmButtonColor: "#121214",
        });
        return prevFileData;
      }

      const validFiles = newFiles.filter(
        (file) =>
          file.type === "application/pdf" && file.size < 30 * 1024 * 1024,
      );

      if (validFiles.length !== newFiles.length) {
        Swal.fire({
          title: "PDF ONLY",
          text: "Only PDF files under 30MB are allowed.",
          icon: "error",
          confirmButtonColor: "#121214",
        });
        return prevFileData;
      }

      Swal.fire({
        title: "SUCCESS",
        text: "File added to your stack!",
        icon: "success",
        confirmButtonColor: "#22d3ee",
      }).then(() => {
        window.scrollTo(0, 0);
        setSelectedFile(null);
      });

      return [
        ...prevFileData,
        ...validFiles.map((file) => ({
          file,
          config: {
            color: "b&w",
            orientation: "portrait",
            pagesToPrint: "all",
            sided: "single",
            copies: 1,
            specificRange: "",
            configured: false,
          },
        })),
      ];
    });
  }, []);

  // Your Logic: File Delete
  const handleFileDelete = useCallback(
    (fileToDelete: File) => {
      Swal.fire({
        title: "REMOVE FILE?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#121214",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "YES, REMOVE",
      }).then((result) => {
        if (result.isConfirmed) {
          setFileData((prev) =>
            prev.filter(({ file }) => file !== fileToDelete),
          );
          if (selectedFile === fileToDelete) setSelectedFile(null);

          if (fileData.length === 1) {
            store.clearAll();
            router.push("/Start");
          }
        }
      });
    },
    [fileData, selectedFile, router, store],
  );

  // Your Logic: Save config
  const handleConfigSave = useCallback((fileName: string, config: any) => {
    setFileData((prev) =>
      prev.map((item) =>
        item.file.name === fileName
          ? { ...item, config: { ...config, configured: true } }
          : item,
      ),
    );
    setSelectedFile(null);
  }, []);

  // Your Logic: Print validation
  const handlePrint = useCallback(() => {
    const allConfigured = fileData.every(({ config }) => config?.configured);

    if (!allConfigured) {
      Swal.fire(
        "ERROR",
        "Please configure all files before printing.",
        "error",
      );
      return;
    }

    Swal.fire({
      title: "CONFIRM PRINT?",
      text: "Proceeding to checkout...",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "YES, PROCEED",
      confirmButtonColor: "#9333ea",
    }).then((result) => {
      if (result.isConfirmed) {
        store.clearAll();
        fileData.forEach(({ file, config }) => store.addFile(file, config));
        router.push("/order-summary");
      }
    });
  }, [fileData, store, router]);

  // Your Logic: File Click
  const handleFileClick = useCallback(
    (file: File) => {
      setSelectedFile(selectedFile === file ? null : file);
      setErrorMessage(null);
    },
    [selectedFile],
  );

  // Your Logic: Preview Renderer
  const renderPreview = useMemo(() => {
    if (!selectedFile) {
      return (
        <p className="text-gray-600 font-bold p-10 text-center uppercase tracking-widest text-xs">
          Select a file to preview
        </p>
      );
    }

    if (selectedFile.type === "application/pdf") {
      const fileURL = URL.createObjectURL(selectedFile);
      return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <div className="h-[600px] bg-brand-matte p-2">
            <Viewer fileUrl={fileURL} />
          </div>
        </Worker>
      );
    }

    if (selectedFile.type.startsWith("image/")) {
      return (
        <div className="p-4 bg-brand-matte">
          <Image
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            width={800}
            height={600}
            className="w-full h-auto rounded-2xl shadow-neu-out"
          />
        </div>
      );
    }

    return <p className="text-red-500 font-black p-4">Format not supported.</p>;
  }, [selectedFile]);

  // Your Logic: Collage Save
  const handleCollageSave = useCallback(
    async (collageElement: HTMLElement) => {
      setLoading(true);
      try {
        const canvas = await html2canvas(collageElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        const dataURL = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(dataURL);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(dataURL, "PNG", 0, 0, pdfWidth, pdfHeight, "", "FAST");
        const file = new File(
          [pdf.output("blob")],
          `collage-${Date.now()}.pdf`,
          {
            type: "application/pdf",
          },
        );

        setFileData((prevData) => [
          ...prevData,
          { file, config: { configured: false } },
        ]);
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
          pageType: "normal",
        });

        Swal.fire("SUCCESS", "Collage Ready!", "success").then(() => {
          setIsCollageEditorOpen(false);
        });
      } catch (error) {
        Swal.fire("ERROR", "Failed to generate collage.", "error");
      } finally {
        setLoading(false);
      }
    },
    [store],
  );

  const handleCollageUpload = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter((file) =>
      file.type.startsWith("image/"),
    );
    if (validFiles.length === 0) {
      Swal.fire("ERROR", "Only JPG/PNG allowed.", "error");
      return;
    }
    setCollageImages(validFiles);
    setIsCollageEditorOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-brand-matte py-12 px-4 antialiased transform-gpu">
      <div className="max-w-4xl mx-auto">
        {/* Title Section */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 bg-brand-matte shadow-neu-in px-4 py-2 rounded-full mb-6 border border-white/5">
            <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full shadow-glow-cyan animate-pulse" />
            <span className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em]">
              {fileData.length}/3 Slots Filled
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
            My{" "}
            <span className="text-brand-cyan drop-shadow-glow-purple">
              Order
            </span>{" "}
            Stack
          </h1>
        </div>

        {/* Files List Section - Recessed Tray */}
        <div className="bg-brand-matte shadow-neu-in p-6 md:p-8 rounded-[3rem] border border-white/5 mb-10">
          <div className="space-y-6">
            {fileData.map(({ file }, index) => (
              <div
                key={index}
                onClick={() => handleFileClick(file)}
                className={`flex justify-between items-center p-6 rounded-3xl cursor-pointer transition-all duration-300 transform-gpu
                  ${
                    selectedFile === file
                      ? "shadow-neu-in-sm translate-y-0.5"
                      : "shadow-neu-out md:hover:scale-[1.01]"
                  }`}
              >
                <div className="flex items-center gap-5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-neu-sm border border-white/5 transition-all
                    ${fileConfigs[file.name]?.configured ? "text-brand-cyan shadow-glow-cyan" : "text-gray-600"}`}
                  >
                    {fileConfigs[file.name]?.configured ? (
                      <TaskAltIcon />
                    ) : (
                      <span className="font-black italic text-sm">
                        0{index + 1}
                      </span>
                    )}
                  </div>
                  <div className="max-w-[150px] md:max-w-md">
                    <h3
                      className={`font-black uppercase tracking-tight truncate italic transition-colors ${selectedFile === file ? "text-brand-cyan" : "text-gray-300"}`}
                    >
                      {file.name}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">
                      {fileConfigs[file.name]?.configured
                        ? "Configuration Locked"
                        : "Setup Required"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileDelete(file);
                  }}
                  className="w-11 h-11 rounded-xl shadow-neu-sm text-gray-600 hover:text-red-400 active:shadow-neu-in-sm transition-all flex items-center justify-center border border-white/5"
                >
                  <DeleteIcon fontSize="small" />
                </button>
              </div>
            ))}
            {fileData.length === 0 && (
              <div className="py-10 text-center text-gray-700 font-bold uppercase text-xs tracking-[0.4em]">
                Empty Tray
              </div>
            )}
          </div>
        </div>

        {/* Config Modal / Overlay */}
        {selectedFile && (
          <div className="fixed inset-0 z-[100] bg-brand-matte/95 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-brand-matte shadow-neu-out rounded-[3rem] w-full max-w-6xl max-h-[95vh] overflow-y-auto border border-white/10 p-2">
              <div className="sticky top-0 bg-brand-matte/80 backdrop-blur-md p-8 flex justify-between items-center z-20 border-b border-white/5">
                <h2 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                  <div className="w-2 h-2 bg-brand-cyan rounded-full shadow-glow-cyan" />
                  Config: {selectedFile.name}
                </h2>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="w-12 h-12 rounded-full shadow-neu-sm flex items-center justify-center text-gray-500 hover:text-white transition-all border border-white/5"
                >
                  ✕
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="shadow-neu-in rounded-3xl overflow-hidden bg-black/20 p-2 min-h-[500px]">
                  {renderPreview}
                </div>
                <div className="shadow-neu-out rounded-3xl p-8 border border-white/5">
                  <PrintConfig
                    selectedFile={selectedFile}
                    initialConfig={fileConfigs[selectedFile.name] || {}}
                    onSave={(config) =>
                      handleConfigSave(selectedFile.name, config)
                    }
                    onClose={() => setSelectedFile(null)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <button
            onClick={() => document.getElementById("file-upload")?.click()}
            className="bg-brand-matte shadow-neu-out p-6 rounded-2xl font-black uppercase text-xs tracking-widest text-gray-400 md:hover:text-brand-cyan active:shadow-neu-in transition-all border border-white/5 flex items-center justify-center gap-3"
          >
            <AddIcon /> Add New PDF
          </button>

          <button
            onClick={() => document.getElementById("collage-upload")?.click()}
            className="bg-brand-matte shadow-neu-out p-6 rounded-2xl font-black uppercase text-xs tracking-widest text-gray-400 md:hover:text-brand-purple active:shadow-neu-in transition-all border border-white/5 flex items-center justify-center gap-3"
          >
            <AddIcon /> Create Collage
          </button>
        </div>

        {/* Final Print Action */}
        {fileData.length > 0 && (
          <div className="mt-12">
            <button
              onClick={handlePrint}
              className="w-full bg-brand-matte text-brand-cyan shadow-neu-out p-10 rounded-[3rem] font-black text-3xl md:text-5xl uppercase italic tracking-tighter border border-brand-cyan/20 md:hover:shadow-glow-cyan active:shadow-neu-in active:scale-[0.98] transition-all flex items-center justify-center gap-6 group"
            >
              <PrintIcon className="scale-150 group-hover:animate-pulse" />{" "}
              Secure Prints
            </button>
          </div>
        )}

        {/* Hidden Inputs */}
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(Array.from(e.target.files!))}
        />
        <input
          id="collage-upload"
          type="file"
          accept=".jpg,.jpeg,.png"
          multiple
          className="hidden"
          onChange={(e) => handleCollageUpload(Array.from(e.target.files!))}
        />

        {/* Loader Overlay */}
        {loading && (
          <div className="fixed inset-0 z-[200] bg-brand-matte/95 flex flex-col items-center justify-center">
            <PacmanLoader color="#22d3ee" size={40} />
            <h2 className="text-brand-cyan font-black uppercase italic mt-12 tracking-[0.4em] animate-pulse text-sm">
              Cooking your Order...
            </h2>
          </div>
        )}
      </div>

      {/* Collage Editor Overlay */}
      {isCollageEditorOpen && (
        <div className="fixed inset-0 bg-brand-matte/95 flex items-center justify-center z-[110] p-4">
          <div className="bg-brand-matte shadow-neu-out p-6 rounded-[3rem] max-w-5xl w-full border border-white/10">
            <CollageEditor
              initialImages={collageImages}
              onSave={handleCollageSave}
              onCancel={() => setIsCollageEditorOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
