"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  getDocument,
  GlobalWorkerOptions,
  version as pdfjsVersion,
} from "pdfjs-dist";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import SaveIcon from "@mui/icons-material/Save";
import { Config } from "@/interfaces";

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

export default function PrintConfig({
  selectedFile,
  initialConfig,
  onSave,
  onClose,
}: {
  selectedFile: File;
  initialConfig: Config;
  onSave: (config: Config) => void;
  onClose: () => void;
}) {
  const [totalPages, setTotalPages] = useState<number>(1);
  const [config, setConfig] = useState<Config>({
    ...initialConfig,
    copies: initialConfig.copies || 1,
    specificRange: initialConfig.specificRange || "",
    color: initialConfig.color || "b&w",
    orientation: initialConfig.orientation || "portrait",
    pagesToPrint: initialConfig.pagesToPrint || "all",
    sided: initialConfig.sided || "single",
    pageType: initialConfig.pageType || "a4",
  });

  useEffect(() => {
    setConfig((prev) => ({ ...prev, ...initialConfig }));
  }, [initialConfig]);

  useEffect(() => {
    if (selectedFile.type === "application/pdf") {
      const fileURL = URL.createObjectURL(selectedFile);
      getDocument({ url: fileURL }).promise.then((pdf) =>
        setTotalPages(pdf.numPages),
      );
    }
  }, [selectedFile]);

  const calculateTotalPrice = useCallback(() => {
    const pricePerPage = config.color === "b&w" ? 2 : 8;
    let pages = totalPages;

    if (config.pagesToPrint === "specific" && config.specificRange) {
      const ranges = config.specificRange
        .split(",")
        .map((range) => range.split("-").map(Number));
      pages = ranges.reduce(
        (total, [start, end]) => total + (end ? end - start + 1 : 1),
        0,
      );
    }
    if (config.sided === "double") pages = pages > 1 ? Math.ceil(pages / 2) : 1;
    return pages * pricePerPage * config.copies;
  }, [config, totalPages]);

  const validateRange = useCallback(
    (specificRange: string): boolean => {
      const regex = /^(\d+(-\d+)?(, \d+(-\d+)?)*|\d+)$/;
      if (!regex.test(specificRange)) return false;
      const ranges = specificRange
        .split(",")
        .map((range) => range.split("-").map(Number));
      for (const [start, end] of ranges) {
        if (start < 1 || (end && end > totalPages)) return false;
      }
      return true;
    },
    [totalPages],
  );

  const handleSave = useCallback(() => {
    if (
      config.pagesToPrint === "specific" &&
      !validateRange(config.specificRange)
    ) {
      Swal.fire("Range Error", `Keep it between 1 and ${totalPages}.`, "error");
      return;
    }
    onSave({ ...config, totalPrice: calculateTotalPrice(), configured: true });
    Swal.fire({
      title: "SAVED",
      text: "Settings applied to stack.",
      icon: "success",
      confirmButtonColor: "#22d3ee",
    }).then(() => onClose());
  }, [config, calculateTotalPrice, validateRange, onSave, onClose, totalPages]);

  const totalPrice = useMemo(
    () => calculateTotalPrice(),
    [calculateTotalPrice],
  );

  // Updated Button Styling Logic for Neumorphism
  const getBtnClass = (active: boolean) =>
    `flex-1 py-3 px-4 font-black uppercase text-[10px] tracking-widest transition-all duration-300 rounded-xl border border-white/5 
    ${
      active
        ? "bg-brand-matte shadow-neu-in text-brand-cyan drop-shadow-glow-cyan"
        : "bg-brand-matte shadow-neu-out text-gray-500 hover:text-gray-300"
    }`;

  return (
    <div className="bg-brand-matte rounded-[2.5rem] p-8 shadow-neu-out relative overflow-hidden transform-gpu border border-white/5">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 relative z-10">
        <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">
          Config{" "}
          <span className="text-brand-purple drop-shadow-glow-purple">
            Panel
          </span>
        </h1>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full shadow-neu-sm flex items-center justify-center text-gray-600 hover:text-white transition-all"
        >
          ✕
        </button>
      </div>

      <div className="space-y-8 relative z-10">
        {/* Color & Orientation Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <label className="block font-black uppercase text-[9px] mb-4 tracking-[0.2em] text-gray-600 ml-2">
              Color Mode
            </label>
            <div className="flex gap-4 bg-brand-matte shadow-neu-in p-2 rounded-2xl">
              <button
                className={getBtnClass(config.color === "b&w")}
                onClick={() => setConfig({ ...config, color: "b&w" })}
              >
                B & W
              </button>
              <button
                className={getBtnClass(config.color === "color")}
                onClick={() => setConfig({ ...config, color: "color" })}
              >
                Color
              </button>
            </div>
          </section>

          <section>
            <label className="block font-black uppercase text-[9px] mb-4 tracking-[0.2em] text-gray-600 ml-2">
              Orientation
            </label>
            <div className="flex gap-4 bg-brand-matte shadow-neu-in p-2 rounded-2xl">
              <button
                className={getBtnClass(config.orientation === "portrait")}
                onClick={() =>
                  setConfig({ ...config, orientation: "portrait" })
                }
              >
                Portrait
              </button>
              <button
                className={getBtnClass(config.orientation === "landscape")}
                onClick={() =>
                  setConfig({ ...config, orientation: "landscape" })
                }
              >
                Landscape
              </button>
            </div>
          </section>
        </div>

        {/* Pages Range */}
        <section>
          <label className="block font-black uppercase text-[9px] mb-4 tracking-[0.2em] text-gray-600 ml-2">
            Page Selection
          </label>
          <div className="flex gap-4 mb-4">
            <button
              className={getBtnClass(config.pagesToPrint === "all")}
              onClick={() =>
                setConfig({ ...config, pagesToPrint: "all", specificRange: "" })
              }
            >
              Print All
            </button>
            <button
              className={getBtnClass(config.pagesToPrint === "specific")}
              onClick={() => setConfig({ ...config, pagesToPrint: "specific" })}
            >
              Specific Range
            </button>
          </div>
          {config.pagesToPrint === "specific" && (
            <input
              type="text"
              className="w-full p-4 bg-brand-matte shadow-neu-in rounded-2xl text-white font-bold text-sm outline-none border border-white/5 focus:border-brand-cyan/30 placeholder:text-gray-700 transition-all"
              placeholder="e.g., 1-5, 8, 11-13"
              value={config.specificRange}
              onChange={(e) =>
                setConfig({ ...config, specificRange: e.target.value })
              }
            />
          )}
        </section>

        {/* Sides & Paper Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <label className="block font-black uppercase text-[9px] mb-4 tracking-[0.2em] text-gray-600 ml-2">
              Duplex
            </label>
            <div className="flex gap-4 bg-brand-matte shadow-neu-in p-2 rounded-2xl">
              <button
                className={getBtnClass(config.sided === "single")}
                onClick={() => setConfig({ ...config, sided: "single" })}
              >
                Single
              </button>
              <button
                className={getBtnClass(config.sided === "double")}
                onClick={() => setConfig({ ...config, sided: "double" })}
              >
                Double
              </button>
            </div>
          </section>

          <section>
            <label className="block font-black uppercase text-[9px] mb-4 tracking-[0.2em] text-gray-600 ml-2">
              Paper Grade
            </label>
            <select
              className="w-full p-4 bg-brand-matte shadow-neu-out rounded-2xl font-black uppercase text-[10px] tracking-widest text-gray-400 outline-none border border-white/5 active:shadow-neu-in transition-all"
              value={config.pageType}
              onChange={(e) =>
                setConfig({ ...config, pageType: e.target.value })
              }
            >
              <option value="a4">Standard A4</option>
              <option value="glossy">Premium Glossy</option>
            </select>
          </section>
        </div>

        {/* Copies Stepper */}
        <section>
          <label className="block font-black uppercase text-[9px] mb-4 tracking-[0.2em] text-gray-600 ml-2">
            Quantity
          </label>
          <div className="flex items-center gap-6 bg-brand-matte shadow-neu-in p-2 rounded-2xl border border-white/5">
            <button
              onClick={() =>
                setConfig({ ...config, copies: Math.max(1, config.copies - 1) })
              }
              className="w-12 h-12 rounded-xl shadow-neu-out flex items-center justify-center text-white active:shadow-neu-in transition-all"
            >
              {" "}
              -{" "}
            </button>
            <div className="flex-1 text-center font-black text-2xl text-brand-cyan drop-shadow-glow-cyan italic">
              {config.copies.toString().padStart(2, "0")}
            </div>
            <button
              onClick={() =>
                setConfig({ ...config, copies: config.copies + 1 })
              }
              className="w-12 h-12 rounded-xl shadow-neu-out flex items-center justify-center text-white active:shadow-neu-in transition-all"
            >
              {" "}
              +{" "}
            </button>
          </div>
        </section>

        {/* Remarks */}
        <section>
          <label className="block font-black uppercase text-[9px] mb-4 tracking-[0.2em] text-gray-600 ml-2">
            Special Instructions
          </label>
          <textarea
            className="w-full p-4 bg-brand-matte shadow-neu-in rounded-2xl text-white font-medium text-sm resize-none border border-white/5 outline-none focus:border-brand-purple/30 transition-all"
            placeholder="Staple, binding, etc..."
            rows={2}
            value={config.remarks}
            onChange={(e) => setConfig({ ...config, remarks: e.target.value })}
          />
        </section>

        {/* Price Display */}
        <div className="bg-brand-matte shadow-neu-in border border-white/5 p-6 rounded-[2rem] flex justify-between items-center group">
          <div>
            <h2 className="font-black uppercase text-[8px] tracking-[0.3em] text-gray-600">
              Billing Est.
            </h2>
            <div className="text-4xl font-black text-brand-cyan drop-shadow-glow-cyan flex items-center gap-1 leading-none mt-1 italic">
              <CurrencyRupeeIcon fontSize="large" className="scale-110" />
              {totalPrice}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-bold uppercase tracking-widest text-gray-600 leading-relaxed">
              B&W: ₹2/pg <br /> COLOR: ₹8/pg
            </p>
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleSave}
          className="w-full bg-brand-matte py-6 rounded-3xl font-black uppercase tracking-[0.4em] text-sm text-brand-cyan shadow-neu-out active:shadow-neu-in active:scale-95 transition-all border border-brand-cyan/20 flex items-center justify-center gap-3 mt-4"
        >
          <SaveIcon fontSize="small" />
          Lock Settings
        </button>
      </div>
    </div>
  );
}
