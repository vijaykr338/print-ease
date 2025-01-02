"use client";

import { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import { FileUpload } from '../../components/ui/FileUpload'; // Adjust the path to where your FileUpload component is
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import PrintIcon from '@mui/icons-material/Print';

import PrintConfig from '../print-config/print-config'; // Adjust the path to where your PDFViewer component is

export default function MyPrints() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileConfigs, setFileConfigs] = useState<{ [key: string]: any }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleFileUpload = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'image/jpeg' || 
      file.type === 'image/png' || 
      file.type.includes('wordprocessingml')
    );

    const duplicateFiles = validFiles.filter(file => 
      files.some(existingFile => existingFile.name === file.name)
    );

    if (duplicateFiles.length > 0) {
      Swal.fire('Error', 'File Already Uploaded', 'error');
      return;
    }

    if (validFiles.length !== newFiles.length) {
      Swal.fire('Error', 'Invalid Format. Only PDF, JPG, and Word files are allowed.', 'error');
      return;
    }

    setFiles([...files, ...validFiles]);
    Swal.fire('Success', 'File Uploaded', 'success').then(() => {
      window.scrollTo(0, 0);
    });
  };

  const handleFileDelete = (fileToDelete: File) => {
    setFiles(files.filter(file => file !== fileToDelete));
    if (selectedFile === fileToDelete) {
      setSelectedFile(null);
    }
    const newConfigs = { ...fileConfigs };
    delete newConfigs[fileToDelete.name];
    setFileConfigs(newConfigs);
  };

  const handleConfigSave = (fileName: string, config: any) => {
    setFileConfigs((prevConfigs) => ({
      ...prevConfigs,
      [fileName]: config,
    }));
  };

  const handlePrint = () => {
    const query = new URLSearchParams();
    let allConfigured = true;

    files.forEach((file, index) => {
      const config = fileConfigs[file.name];
      if (!config || Object.keys(config).length === 0) {
        allConfigured = false;
      }
      query.append(`file${index}`, file.name);
      query.append(`config${index}`, JSON.stringify(config));
    });

    if (!allConfigured) {
      Swal.fire('Error', 'Please configure your files', 'error');
      return;
    }

    router.push(`/order-summary?${query.toString()}`);
  };

  const handleFileClick = (file: File) => {
    if (selectedFile === file) {
      setSelectedFile(null);
    } else {
      setSelectedFile(file);
    }
    setErrorMessage(null);
  };

  const renderPreview = (file: File) => {
    if (!file) {
      return <p className="text-gray-500 p-4">File not found or cannot be loaded.</p>;
    }

    if (file.type === 'application/pdf') {
      const fileURL = URL.createObjectURL(file);
      return (
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.0/build/pdf.worker.min.js`}>
          <div style={{ height: '750px' }}>
            <Viewer fileUrl={fileURL} />
          </div>
        </Worker>
      );
    }

    if (file.type === "image/jpeg" || file.type === "image/png") {
      return <img src={URL.createObjectURL(file)} alt="Preview" className="w-full rounded-lg" />;
    }

    if (file.type.includes("wordprocessingml")) {
      return <p className="text-gray-500 p-4">DOC/DOCX preview not available.</p>;
    }

    return <p className="text-gray-500 p-4">Preview not available for this file type.</p>;
  };

  return (
    <div className={`bg-gray-900 text-white max-w-2xl mx-auto p-6`}>
      <h1 className="text-4xl text-center font-semibold mb-10">My Prints</h1>

      {files.length === 0 && (
        <div className="flex justify-center items-center mb-4">
          <FileUpload onChange={handleFileUpload} />
        </div>
      )}

      {files.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No prints yet. Add your first document!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>

          {files.map((file, index) => (
            <div
              key={index}
              className={`flex justify-between items-center cursor-pointer p-4 bg-gray-800 rounded-lg ${selectedFile === file ? "ring-2 ring-blue-500" : ""}`}
            >
              <span onClick={() => handleFileClick(file)}>
                {file.name} {fileConfigs[file.name] ? "(configured)" : ""}
              </span>
              <button
                onClick={() => handleFileDelete(file)}
                className="text-red-500 hover:text-red-700"
              >
                <DeleteIcon />
              </button>
            </div>
          ))}

          {selectedFile && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 sm:text-xs md:text-lg">
               <span className='text-gray-500'> Preview: </span>{selectedFile.name}
              </h2>
              {renderPreview(selectedFile)}

              <div className="mt-4">
                <PrintConfig
                  selectedFile={selectedFile}
                  initialConfig={fileConfigs[selectedFile.name] || {}}
                  onSave={(config) => handleConfigSave(selectedFile.name, config)}
                />
              </div>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={() => document.getElementById('file-upload')?.click()}
              className="w-full relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl gap-2">
                <AddIcon />Upload More Files
              </span>
            </button>
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              multiple
              onChange={(e) => {
                const newFiles = Array.from(e.target.files!);
                const validFiles = newFiles.filter(file => 
                  file.type === 'application/pdf' || 
                  file.type === 'image/jpeg' || 
                  file.type === 'image/png' || 
                  file.type.includes('wordprocessingml')
                );

                const duplicateFiles = validFiles.filter(file => 
                  files.some(existingFile => existingFile.name === file.name)
                );

                if (duplicateFiles.length > 0) {
                  Swal.fire('Error', 'File Already Uploaded', 'error');
                  return;
                }

                if (validFiles.length !== newFiles.length) {
                  Swal.fire('Error', 'Invalid Format. Only PDF, JPG, and Word files are allowed.', 'error');
                  return;
                }

                setFiles([...files, ...validFiles]);
                Swal.fire('Success', 'File Uploaded', 'success').then(() => {
                  window.scrollTo(0, 0);
                });
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
          
        
        <button onClick={handlePrint} className="w-full inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 gap-2">
          <PrintIcon />
          Print
        </button>
  
      
          </div>
        </div>
      )}
    </div>
  );
}
