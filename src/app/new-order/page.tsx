"use client";

import { useState, useCallback, useMemo } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { FileUpload } from "../../components/ui/FileUpload";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import CollageEditor from "../collageEditor/CollageEditor";
import PrintConfig from "../print-config/print-config";
import useFileStore from "@/store/filesStore";

export default function MyPrints() {
  const store = useFileStore();
  const [fileData, setFileData] = useState<{ file: File; config: any }[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCollageEditorOpen, setIsCollageEditorOpen] = useState(false);
  const [collageImages, setCollageImages] = useState<File[]>([]);
  const router = useRouter();

  const fileConfigs = useMemo(() => {
    const configs: { [key: string]: any } = {};
    fileData.forEach(({ file, config }) => {
      configs[file.name] = config;
    });
    return configs;
  }, [fileData]);

  const handleFileUpload = useCallback(
    (newFiles: File[]) => {
      if (fileData.length + newFiles.length > 3) {
        Swal.fire("Error", "You can upload a maximum of 3 files.", "error");
        return;
      }

      const validFiles = newFiles.filter(
        (file) =>
          file.type === "application/pdf" && file.size < 30 * 1024 * 1024
      );

      if (validFiles.length !== newFiles.length) {
        Swal.fire(
          "Error",
          "Invalid Format or File Size. Only PDF files under 30MB are allowed.",
          "error"
        );
        return;
      }

      setFileData((prev) => [
        ...prev,
        ...validFiles.map((file) => ({
          file,
          config: {
            color: "b&w",
            orientation: "portrait",
            pagesToPrint: "all",
            sided: "single",
            copies: 1,
            specificRange: "",
          },
        })),
      ]);

      Swal.fire("Success", "File Uploaded", "success").then(() => {
        window.scrollTo(0, 0);
      });
    },
    [fileData]
  );

  const handleFileDelete = useCallback(
    (fileToDelete: File) => {
      setFileData((prev) => prev.filter(({ file }) => file !== fileToDelete));
      if (selectedFile === fileToDelete) setSelectedFile(null);
    },
    [selectedFile]
  );

  const handleConfigSave = useCallback((fileName: string, config: any) => {
    setFileData((prev) =>
      prev.map((item) =>
        item.file.name === fileName
          ? { ...item, config: { ...config, configured: true } }
          : item
      )
    );

    setSelectedFile((prevSelected) =>
      prevSelected?.name === fileName ? null : prevSelected
    );
  }, []);

  const handlePrint = useCallback(() => {
    if (fileData.length === 0) return;

    const allConfigured = fileData.every(({ config }) => config?.configured);

    if (!allConfigured) {
      Swal.fire(
        "Error",
        "Please configure all files before printing.",
        "error"
      );
      return;
    }

    fileData.forEach(({ file, config }) => store.addFile(file, config));

    // Ensure fileData is not cleared before navigation
    router.push(`/order-summary`);
  }, [fileData, store, router]);

  const handleFileClick = useCallback(
    (file: File) => {
      if (selectedFile === file) {
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
      }
      setErrorMessage(null);
    },
    [selectedFile]
  );

  const renderPreview = useMemo(() => {
    if (!selectedFile) {
      return (
        <p className="text-gray-500 p-4">File not found or cannot be loaded.</p>
      );
    }

    if (selectedFile.type === "application/pdf") {
      const fileURL = URL.createObjectURL(selectedFile);
      return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <div style={{ height: "750px" }}>
            <Viewer fileUrl={fileURL} />
          </div>
        </Worker>
      );
    }

    if (selectedFile.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(selectedFile)}
          alt="Preview"
          className="w-full rounded-lg"
        />
      );
    }

    return (
      <p className="text-gray-500 p-4">
        Preview not available for this file type.
      </p>
    );
  }, [selectedFile]);

  const handleCollageSave = useCallback(
    (collage: File) => {
      setFileData((prevData) => [...prevData, { file: collage, config: {} }]); // Assuming an empty config
      setIsCollageEditorOpen(false);
      Swal.fire("Success", "Collage Saved", "success");
    },
    [] // No dependencies needed
  );

  const handleCollageUpload = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length === 0) {
      Swal.fire(
        "Error",
        "Invalid Format. Only JPG and PNG files are allowed.",
        "error"
      );
      return;
    }

    setCollageImages(validFiles);
    setIsCollageEditorOpen(true);
  }, []);

  return (
    <div className={`bg-gray-800  max-w-2xl mx-auto p-6 mt-10`}>
      <h1 className="text-white text-4xl text-center font-semibold mb-10">
        My Prints
      </h1>

      {fileData.length === 0 && (
        <div className="flex justify-center items-center mb-4 flex-col w-full">
          <FileUpload onChange={handleFileUpload} />
          <div className="mt-4">
            <button
              onClick={() => document.getElementById("collage-upload")?.click()}
              className="w-full relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="text-white inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black px-3 py-1 text-sm font-bold  backdrop-blur-3xl gap-2">
                <AddIcon />
                Create Collage
              </span>
            </button>

            <input
              id="collage-upload"
              type="file"
              accept=".jpg,.jpeg,.png"
              multiple
              onChange={(e) => {
                const newFiles = Array.from(e.target.files!);
                handleCollageUpload(newFiles);
              }}
              className="hidden"
            />
          </div>
        </div>
      )}

      {fileData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white">No prints yet. Add your first document!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl text-white font-semibold mb-4">
            Uploaded Files
          </h2>
          <p className="text-gray-300 text-sm font-light">
            Click on the file to set the configurations.
          </p>
          {fileData.map(({ file }, index) => (
            <div
              key={index}
              className={`flex justify-between items-center cursor-pointer p-4 bg-gray-900 text-white  rounded-lg ${
                selectedFile === file ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => handleFileClick(file)} // Apply click handler to the entire div
            >
              <span>
                {file.name}{" "}
                {fileData.find((item) => item.file.name === file.name)?.config
                  .configured
                  ? "(configured)"
                  : ""}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the div click event
                  handleFileDelete(file);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <DeleteIcon />
              </button>
            </div>
          ))}

          {selectedFile && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 sm:text-xs md:text-lg">
                <span className="text-gray-500 dark:text-gray-400">
                  {" "}
                  Preview:{" "}
                </span>
                <span className="text-white">{selectedFile.name}</span>
              </h2>
              {renderPreview}

              <div className="mt-4">
                <PrintConfig
                  selectedFile={selectedFile}
                  initialConfig={fileConfigs[selectedFile.name] || {}}
                  onSave={(config) =>
                    handleConfigSave(selectedFile.name, config)
                  }
                  onClose={() => setSelectedFile(null)} // Pass onClose prop
                />
              </div>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={() => document.getElementById("file-upload")?.click()}
              className="w-full relative inline-flex  h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 "
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl gap-2">
                <AddIcon />
                Upload More Files
              </span>
            </button>

            <input
              id="file-upload"
              type="file"
              accept=".pdf" // Only accept PDF files
              multiple
              onChange={(e) => {
                const newFiles = Array.from(e.target.files!);
                if (newFiles.length > 3) {
                  Swal.fire(
                    "Error",
                    "You can upload a maximum of 3 files at a time.",
                    "error"
                  );
                  return;
                }
                handleFileUpload(newFiles);
              }}
              className="hidden"
            />
          </div>

          <div className="mt-4">
            <button
              onClick={() => document.getElementById("collage-upload")?.click()}
              className="w-full relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="text-white inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black px-3 py-1 text-sm font-medium backdrop-blur-3xl gap-2">
                <AddIcon />
                Create Collage
              </span>
            </button>

            <input
              id="collage-upload"
              type="file"
              accept=".jpg,.jpeg,.png"
              multiple
              onChange={(e) => {
                const newFiles = Array.from(e.target.files!);
                handleCollageUpload(newFiles);
              }}
              className="hidden"
            />
          </div>

          {errorMessage && (
            <div className="mt-4 p-4 border border-red-700 rounded-lg">
              <h2 className="font-semibold text-red-500">{errorMessage}</h2>
            </div>
          )}

          <div className="mt-8 ">
            <button
              onClick={handlePrint}
              className="w-full inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 gap-2"
            >
              <PrintIcon />
              Print
            </button>
          </div>
        </div>
      )}

      {isCollageEditorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg max-w-4xl w-full flex justify-center items-center flex-col">
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
