"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getDocument,
  GlobalWorkerOptions,
  version as pdfjsVersion,
} from "pdfjs-dist";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import SaveIcon from '@mui/icons-material/Save';

// Set the worker URL for pdfjs-dist
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

type Config = {
  color: string;
  pageSize: string;
  orientation: string;
  pagesToPrint: string;
  sided: string;
  copies: number;
  remarks: string;
  specificRange: string;
  totalPrice: number;
};

export default function PrintConfig({
  selectedFile,
  initialConfig,
  onSave,
}: {
  selectedFile: File;
  initialConfig: Config;
  onSave: (config: Config) => void;
}) {
  const router = useRouter();

  const [config, setConfig] = useState<Config>({
    ...initialConfig,
    copies: initialConfig.copies || 1, // Ensure copies has a default value
    specificRange: initialConfig.specificRange || "", // Ensure specificRange has a default value
  });
  const [totalPages, setTotalPages] = useState<number>(10);

  useEffect(() => {
    setConfig((prevConfig: Config) => ({
      ...prevConfig,
      ...initialConfig,
    }));
  }, [initialConfig]);

  useEffect(() => {
    if (selectedFile.type === "application/pdf") {
      const fileURL = URL.createObjectURL(selectedFile);
      getDocument({ url: fileURL })
        .promise.then((pdf) => {
          setTotalPages(pdf.numPages);
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });
    }
  }, [selectedFile]);

  const calculateTotalPrice = () => {
    if (!config.color) {
      return 0; // Return 0 if color mode is not selected
    }
    const pricePerPage = config.color === "bw" ? 2 : 5;
    let pages = totalPages;

    if (config.pagesToPrint === "specific" && config.specificRange) {
      const ranges: [number, number?][] = config.specificRange
        .split(",")
        .map((range) => range.split("-").map(Number) as [number, number?]);
      pages = ranges.reduce(
        (total, [start, end]) => total + (end ? end - start + 1 : 1),
        0
      );
    }

    if (config.sided === "double") {
      pages = Math.ceil(pages / 2); // Half the pages for double-sided, rounding up for odd numbers
    }

    return pages * pricePerPage * config.copies;
  };

  const validateRange = (specificRange: string): boolean => {
    const regex = /^(\d+(-\d+)?(, \d+(-\d+)?)*|\d+)$/;
    if (!regex.test(specificRange)) {
      return false;
    }

    const ranges: [number, number?][] = specificRange
      .split(",")
      .map((range) => range.split("-").map(Number) as [number, number?]);

    for (const [start, end] of ranges) {
      if (start < 1 || (end && end > totalPages)) {
        return false;
      }
    }

    return true;
  };

  const handleSave = () => {
    if (
      !config.color ||
      !config.pageSize ||
      !config.orientation ||
      !config.pagesToPrint ||
      config.copies === 0 ||
      !config.sided
    ) {
      Swal.fire(
        "Error",
        "Please ensure all fields are selected except remarks.",
        "error"
      );
      return;
    }

    if (
      config.pagesToPrint === "specific" &&
      !validateRange(config.specificRange)
    ) {
      Swal.fire(
        "Error",
        `Invalid range format or range out of bounds! Ensure the range is within 1 to ${totalPages}.`,
        "error"
      );
      return;
    }

    const totalPrice = calculateTotalPrice();
    if (isNaN(totalPrice)) {
      Swal.fire(
        "Error",
        "Error calculating total price. Please check your configuration.",
        "error"
      );
      return;
    }
    onSave({ ...config, totalPrice });
    Swal.fire("Success", "File Configured", "success");
  };

  return (
    <div className={`max-w-2xl mx-auto p-6 rounded-lg `}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold sm:text-xs">
          Print Configuration
        </h1>
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-200"
        >
          Cancel
        </button>
      </div>

      <div className="space-y-6">
        {/* Color Mode */}
        <div className="p-4 border border-gray-700 rounded-lg">
          <h2 className="font-semibold mb-4">Color Mode</h2>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                config.color === "bw"
                  ? "bg-gray-700 text-white"
                  : "border border-gray-600 hover:border-gray-400"
              }`}
              onClick={() => setConfig({ ...config, color: "bw" })}
            >
              Black & White
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                config.color === "color"
                  ? "bg-gray-700 text-white"
                  : "border border-gray-600 hover:border-gray-400"
              }`}
              onClick={() => setConfig({ ...config, color: "color" })}
            >
              Color
            </button>
          </div>
        </div>

        {/* Page Size */}
        <div className="p-4 border border-gray-700 rounded-lg">
          <h2 className="font-semibold mb-4">Page Size</h2>
          <select
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white"
            value={config.pageSize || ""}
            onChange={(e) => setConfig({ ...config, pageSize: e.target.value })}
          >
            <option value="" disabled>
              Select Page Size
            </option>
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
            <option value="legal">Legal</option>
          </select>
        </div>

        {/* Orientation */}
        <div className="p-4 border border-gray-700 rounded-lg">
          <h2 className="font-semibold mb-4">Orientation</h2>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                config.orientation === "portrait"
                  ? "bg-gray-700 text-white"
                  : "border border-gray-600 hover:border-gray-400"
              }`}
              onClick={() => setConfig({ ...config, orientation: "portrait" })}
            >
              Portrait
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                config.orientation === "landscape"
                  ? "bg-gray-700 text-white"
                  : "border border-gray-600 hover:border-gray-400"
              }`}
              onClick={() => setConfig({ ...config, orientation: "landscape" })}
            >
              Landscape
            </button>
          </div>
        </div>

        {/* Pages to Print */}
        <div className="p-4 border border-gray-700 rounded-lg">
          <h2 className="font-semibold mb-4">Pages to Print</h2>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                config.pagesToPrint === "all"
                  ? "bg-gray-700 text-white"
                  : "border border-gray-600 hover:border-gray-400"
              }`}
              onClick={() =>
                setConfig({ ...config, pagesToPrint: "all", specificRange: "" })
              }
            >
              All Pages
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                config.pagesToPrint === "specific"
                  ? "bg-gray-700 text-white"
                  : "border border-gray-600 hover:border-gray-400"
              }`}
              onClick={() => setConfig({ ...config, pagesToPrint: "specific" })}
            >
              Specific Range
            </button>
          </div>
          {config.pagesToPrint === "specific" && (
            <input
              type="text"
              className="mt-4 w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white"
              placeholder="Enter page range (e.g., 1-5, 8, 11-13)"
              value={config.specificRange}
              onChange={(e) =>
                setConfig({ ...config, specificRange: e.target.value })
              }
            />
          )}
        </div>

        {/* Print Type */}
        <div className="p-4 border border-gray-700 rounded-lg">
          <h2 className="font-semibold mb-4">Print Type</h2>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                config.sided === "single"
                  ? "bg-gray-700 text-white"
                  : "border border-gray-600 hover:border-gray-400"
              }`}
              onClick={() => setConfig({ ...config, sided: "single" })}
            >
              Single Sided
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                config.sided === "double"
                  ? "bg-gray-700 text-white"
                  : "border border-gray-600 hover:border-gray-400"
              }`}
              onClick={() => setConfig({ ...config, sided: "double" })}
            >
              Double Sided
            </button>
          </div>
        </div>

        {/* Copies */}
        <div className="p-4 border border-gray-700 rounded-lg">
          <h2 className="font-semibold mb-4">Copies</h2>
          <input
            type="number"
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white"
            value={config.copies}
            onChange={(e) =>
              setConfig({
                ...config,
                copies: e.target.value ? Number(e.target.value) : 0,
              })
            }
            min="1"
            disabled={!config.color} // Disable input if color mode is not selected
          />
        </div>

        {/* Remarks */}
        <div className="p-4 border border-gray-700 rounded-lg">
          <h2 className="font-semibold mb-4">Remarks</h2>
          <textarea
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white resize-none"
            placeholder="Add any remarks here"
            rows={3}
            value={config.remarks}
            onChange={(e) => setConfig({ ...config, remarks: e.target.value })}
          />
        </div>

        {/* Total Price */}
        <div className="p-4 border border-gray-700 rounded-lg">
          <h2 className="font-semibold mb-4">
            Total Price: Rs. {calculateTotalPrice()}
          </h2>
        </div>

        <button onClick={handleSave} className="w-full relative inline-flex  h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 ">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl gap-2">
           <SaveIcon />Save
          </span>
        </button>
      </div>
    </div>
  );
}
