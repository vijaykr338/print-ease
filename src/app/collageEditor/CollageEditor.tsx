import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import PacmanLoader from "react-spinners/PacmanLoader";

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
    height: 500,
  });
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const imageObjects = initialImages.map((file, index) => ({
      id: index,
      url: URL.createObjectURL(file),
      x: index * 20, // Slight shift for each photo
      y: index * 20,
      width: 150,
      height: 150,
    }));
    setImages(imageObjects);

    return () => {
      imageObjects.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [initialImages]);

  useEffect(() => {
    const updateContainerSize = () => {
      const width = window.innerWidth < 500 ? window.innerWidth - 20 : 500;
      const height = window.innerHeight < 500 ? window.innerHeight - 20 : 500;
      setContainerSize({ width, height });
    };

    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);

    return () => {
      window.removeEventListener("resize", updateContainerSize);
    };
  }, []);

  const handleDragResize = (id: number, data: any) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === id
          ? {
              ...img,
              x: data.x,
              y: data.y,
              width: data.width,
              height: data.height,
            }
          : img
      )
    );
  };

  const handleDeleteImage = () => {
    if (selectedImage === null) return;
    const deletedImg = images.find((img) => img.id === selectedImage);
    if (deletedImg) URL.revokeObjectURL(deletedImg.url);
    setImages(images.filter((img) => img.id !== selectedImage));
    setSelectedImage(null);
  };

  const handleExportCollage = async () => {
    const collageElement = document.getElementById("collage-container");

    if (!collageElement || collageElement.children.length === 0) {
      Swal.fire("Warning", "No images in the collage to export!", "warning");
      return;
    }

    setIsExporting(true); // Show the loader

    try {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Ensure UI updates
      await onSave(collageElement);
    } catch (error) {
      console.error("Error exporting collage:", error);
      Swal.fire("Error", "Failed to export collage. Try again!", "error");
    } finally {
      setIsExporting(false); // Hide the loader
    }
  };

  const handleAddImage = (newFiles: File[]) => {
    const validFiles = newFiles.filter(
      (file) => file.type === "image/jpeg" || file.type === "image/png"
    );

    if (validFiles.length !== newFiles.length) {
      Swal.fire(
        "Error",
        "Invalid Format. Only JPG and PNG files are allowed.",
        "error"
      );
      return;
    }

    const newImageObjects = validFiles.map((file, index) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      x: (images.length + index) * 20, // Slight shift for each new photo
      y: (images.length + index) * 20,
      width: 150,
      height: 150,
    }));

    setImages([...images, ...newImageObjects]);
  };

  const handleAlignImages = () => {
    const margin = 10;
    const { width, height } = containerSize;
    const numImages = images.length;

    if (numImages < 2 || numImages > 6) {
      Swal.fire(
        "Error",
        "Alignment is only supported for 2 to 6 images.",
        "error"
      );
      return;
    }

    // Calculate grid dimensions (rows & cols)
    const cols = Math.ceil(Math.sqrt(numImages));
    const rows = Math.ceil(numImages / cols);

    const cellWidth = (width - (cols + 1) * margin) / cols;
    const cellHeight = (height - (rows + 1) * margin) / rows;

    // Generate grid layout
    const layout = images.map((_, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      return {
        x: margin + col * (cellWidth + margin),
        y: margin + row * (cellHeight + margin),
        width: cellWidth,
        height: cellHeight,
      };
    });

    setImages(images.map((img, i) => ({ ...img, ...layout[i] })));
  };

  return (
    <div className="w-screen flex flex-col items-center">
      <div
        id="collage-container"
        className="relative border border-gray-500 bg-gray-300"
        style={{ width: containerSize.width, height: containerSize.height }}
      >
        {images.map((image) => (
          <Rnd
            key={image.id}
            size={{ width: image.width, height: image.height }}
            position={{ x: image.x, y: image.y }}
            bounds="parent"
            onDragStop={(e, d) =>
              handleDragResize(image.id, { ...image, x: d.x, y: d.y })
            }
            onResizeStop={(e, direction, ref, delta, position) =>
              handleDragResize(image.id, {
                ...image,
                width: ref.offsetWidth,
                height: ref.offsetHeight,
                x: position.x,
                y: position.y,
              })
            }
            style={{
              border: selectedImage === image.id ? "2px solid blue" : "none",
              cursor: "grab",
            }}
            onClick={() => setSelectedImage(image.id)}
          >
            <img
              src={image.url}
              alt="collage"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                pointerEvents: "none",
              }}
            />
          </Rnd>
        ))}
      </div>

      {isExporting && (
        <div className="fixed inset-0 z-50 flex justify-center items-center flex-col bg-black bg-opacity-80">
          <PacmanLoader color="white" loading={isExporting} size={50} />
          <p className="text-gray-400 font-thin mt-6">Exporting Collage...</p>
        </div>
      )}

      <div className="flex mt-4 gap-4 justify-between">
        <div className="flex flex-col gap-2">
          <button
            onClick={handleExportCollage}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Export Collage
          </button>

          {selectedImage !== null && (
            <button
              onClick={handleDeleteImage}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              <DeleteIcon /> Delete Image
            </button>
          )}
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => document.getElementById("add-image")?.click()}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            <AddIcon /> Add Image
          </button>
          <input
            id="add-image"
            type="file"
            accept=".jpg,.jpeg,.png"
            multiple
            onChange={(e) => handleAddImage(Array.from(e.target.files!))}
            className="hidden"
          />

          <button
            onClick={handleAlignImages}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Align Images
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollageEditor;
