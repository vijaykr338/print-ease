"use client";

import React, { useState, useCallback } from "react";
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

  const handleFileUpload = (files: File[]) => {
    const existingFiles = store.filesWithConfigs.map((item) => item.file.name);
    const newFiles = files.filter((file) => !existingFiles.includes(file.name));

    if (newFiles.length === 0) {
      return; // No new files to add
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
      }); // Add files to the store with a default config
    });

    setLoading(true); // Set loading state to true
    router.push("/new-order"); // Route to new-order page after file upload
    setLoading(false); // Set loading state to false
    Swal.fire("Success", "Files Uploaded", "success");
  };

  const handleCollageUpload = (newFiles: File[]) => {
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
  };

  const handleCollageSave = useCallback(
    async (collageElement: HTMLElement) => {
      setLoading(true); // Set loading state to true

      try {
        const canvas = await html2canvas(collageElement, {
          scale: 2, // Optimize scale for performance
          useCORS: true,
          backgroundColor: null,
        });

        const dataURL = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(dataURL);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(dataURL, "PNG", 0, 0, pdfWidth, pdfHeight, "", "FAST");
        const pdfBlob = pdf.output("blob");

        const file = new File([pdfBlob], "collage.pdf", {
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
        }); // Add the collage PDF to the store with a default config

        Swal.fire("Success", "Collage Saved", "success").then(() => {
          setIsCollageEditorOpen(false);
          router.push("/new-order"); // Route to new-order page after saving the collage
        });
      } catch (error) {
        console.error("Error exporting collage:", error);
        Swal.fire("Error", "Failed to export collage. Try again!", "error");
      } finally {
        setLoading(false); // Set loading state to false
      }
    },
    [router, store]
  );

  return (
    <div className={`bg-gray-800 max-w-2xl mx-auto p-6 mt-10`}>
      <h1 className="text-white text-4xl text-center font-semibold mb-10">
        My Prints
      </h1>
      {loading && (
        <div className="fixed inset-0 z-50 flex justify-center items-center flex-col bg-black bg-opacity-80">
          <PacmanLoader
            color="white"
            loading={loading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <p className="text-gray-400 font-thin mt-6">Loading...</p>
        </div>
      )}
      {!loading && fileData.length === 0 && (
        <div className="flex justify-center items-center mb-4 flex-col w-full">
          <FileUpload onChange={handleFileUpload} />
          <div className="mt-4">
            <button
              onClick={() => document.getElementById("collage-upload")?.click()}
              className="w-full relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="text-white inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black px-3 py-1 text-sm font-bold backdrop-blur-3xl gap-2">
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

      {!loading && (
        <div className="text-center py-12">
          <p className="text-white">No prints yet. Add your first document!</p>
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
};

export default Start;
