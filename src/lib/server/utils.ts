"use server";

import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
const apiKey = process.env.CLOUDINARY_API_KEY || "";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "";
const uploadFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || "print-ease";

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

type CloudinaryUploadResult = {
  url: string;
  publicId: string;
};

/**
 * Upload a file to Cloudinary.
 */
export async function uploadFileToCloudinary(
  file: File
): Promise<CloudinaryUploadResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const uniqueName = `${Date.now()}-${randomUUID()}`;
  const fileName = file.name.replace(/\s+/g, "-");
  const publicId = `${uploadFolder}/${uniqueName}-${fileName}`;

  const result = await new Promise<any>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          type: "upload",
          access_mode: "public",
          public_id: publicId,
          use_filename: false,
          unique_filename: false,
          overwrite: true,
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error || new Error("Cloudinary upload failed"));
            return;
          }
          resolve(uploadResult);
        }
      );

      stream.end(buffer);
    }
  );

  return { url: result.secure_url, publicId: result.public_id };
}

/**
 * Delete a file from Cloudinary using its public ID.
 */
export async function deleteFileFromCloudinary(publicId: string) {
  try {
    if (!publicId) {
      throw new Error("Missing Cloudinary public ID.");
    }

    const deleteResponse = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
      invalidate: true,
    });

    return {
      success: deleteResponse.result === "ok",
      message:
        deleteResponse.result === "ok"
          ? `File '${publicId}' deleted successfully.`
          : `File '${publicId}' not found or already deleted.`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Error deleting file: ${error.message}`,
    };
  }
}
  