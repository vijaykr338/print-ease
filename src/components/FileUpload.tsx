import React, { useState } from "react";
import Image from "next/image";

interface FileUploaderProps {
    onFileUpload: (
        files: File[],
        selectedColumn: string | undefined,
        inputValue: string
    ) => void;
    acceptType: string;
    inputType?: string;
    placeholder?: string;
    label?: string;
    buttonText?: string;
    multiple?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
    // onFileUpload,
    acceptType,
    buttonText = "Upload Leads",
    multiple = false,
}) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            setFiles(droppedFiles);
        }
        setIsHovered(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = e.target.files ? Array.from(e.target.files) : [];
        if (uploadedFiles.length > 0) {
            setFiles(uploadedFiles);
            // other logic
        }
    };

    const handleSubmit = async () => {
        if (files.length > 0) {
            setIsLoading(true);
            try {
                // await onFileUpload(files);     //HANDLE THIS FUNCTION
                alert("Media uploaded successfully!");
            // } catch (error) {
            //     alert("Failed to upload media. Please try again.");
            } finally {
                setIsLoading(false);
            }
        } else {
            alert("Please select files to upload.");
        }
    };

    const handleDragEnter = () => setIsHovered(true);
    const handleDragLeave = () => setIsHovered(false);

    return (
        <div className="p-6 text-center bg-gray-900 text-white">
            <div
                className={`border-2 border-dashed rounded-xl p-6 relative ${
                    isHovered ? "bg-gray-700" : "bg-gray-800"
                }`}
                style={{ minHeight: "300px", minWidth: "350px" }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
            >
                {files.length > 0 ? (
                    <div>
                        <p className="mb-2">
                            {isHovered
                                ? "Drop it like it's hot!"
                                : `Uploaded file(s): ${files.map((f) => f.name).join(", ")}`}
                        </p>
                    </div>
                ) : (
                    <div>
                        {!isHovered && (
                            <Image
                                src="/dropfile.png"
                                alt="Drop file here"
                                width={128}
                                height={128}
                                className="h-32 mx-auto mb-4"
                            />
                        )}
                        <p>
                            {isHovered
                                ? "Drop it like it's hot!"
                                : "Drag and drop files here or click to upload"}
                        </p>
                    </div>
                )}
                <input
                    type="file"
                    accept={acceptType}
                    onChange={handleFileChange}
                    style={{ minHeight: "200px" }}
                    className="absolute top-0 left-0 w-full h-full opacity-0"
                    multiple={multiple}
                />
            </div>

            <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                onClick={handleSubmit}
                disabled={files.length === 0 || isLoading}
            >
                {buttonText}
            </button>
        </div>
    );
};

export default FileUploader;
