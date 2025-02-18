"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getDocument, GlobalWorkerOptions, version as pdfjsVersion } from "pdfjs-dist";

// Set the worker URL for pdfjs-dist
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

export default function OrderSummary() {
  const router = useRouter();
  const searchParams = useSearchParams();

  interface Config {
    color: string;
    pagesToPrint: string;
    specificRange?: string;
    file?: string;
    copies: number;
    pageSize: string;
    orientation: string;
    sided: string;
    remarks: string;
    totalPrice: number;
  }

  const files: string[] = [];
  const configs: Config[] = [];

  for (let i = 0; searchParams.get(`file${i}`); i++) {
    files.push(searchParams.get(`file${i}`) as string);
    const config = searchParams.get(`config${i}`);
    if (config) {
      configs.push(JSON.parse(config) as Config);
    }
  }

  const [orderDetails, setOrderDetails] = useState(
    configs.map((config, index) => ({
      ...config,
      file: files[index],
    }))
  );

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-semibold mb-8">Order Summary</h1>

      {orderDetails.map((details, index) => (
        <div key={index} className="space-y-6">
          <div className="p-4 border border-gray-700 rounded-lg">
            <h2 className="font-semibold mb-4">File: {details.file}</h2>
            <h2 className="font-semibold mb-4">
              Color Mode: {details.color === "bw" ? "Black & White" : "Color"}
            </h2>
            <h2 className="font-semibold mb-4">Page Size: {details.pageSize}</h2>
            <h2 className="font-semibold mb-4">Orientation: {details.orientation}</h2>
            <h2 className="font-semibold mb-4">Pages to Print: {details.pagesToPrint}</h2>
            <h2 className="font-semibold mb-4">
              Print Type: {details.sided === "single" ? "Single Sided" : "Double Sided"}
            </h2>
            <h2 className="font-semibold mb-4">Copies: {details.copies}</h2>
            <h2 className="font-semibold mb-4">Remarks: {details.remarks}</h2>
          </div>

          <div className="p-4 border border-gray-700 rounded-lg">
            <h2 className="font-semibold mb-4">Total Price: Rs. {details.totalPrice}</h2>
          </div>
        </div>
      ))}

      <div className="mt-8">
        <button
          onClick={() => router.push("/my-prints")}
          className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Go Back to Prints
        </button>
      </div>
    </div>
  );
}

function getTotalPagesFromFile(fileURL: string): Promise<number> {
  return new Promise((resolve, reject) => {
    getDocument({ url: fileURL })
      .promise.then((pdf) => {
        resolve(pdf.numPages);
      })
      .catch((error) => {
        console.error("Error getting document:", error);
        reject(new Error("MissingPDFException"));
      });
  });
}

function includes(str: string, substr: string): boolean {
  return str.indexOf(substr) !== -1;
}


