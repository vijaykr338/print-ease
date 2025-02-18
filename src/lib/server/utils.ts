"use server";
import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";

const ACCOUNT_NAME = process.env.NEXT_PUBLIC_ACCOUNT_NAME || "";
const CONTAINER_NAME = "user-files";

const blobServiceClient = new BlobServiceClient(
  `https://${ACCOUNT_NAME}.blob.core.windows.net`,
  new DefaultAzureCredential()
);

const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

/**
 * Upload a file to Azure Blob Storage.
 */
export async function uploadFileToAzure(file: File) {
  //const buffer = await streamToBuffer(file.stream())
  //experiment
  const buffer = await file.arrayBuffer();
  const blockBlobClient = containerClient.getBlockBlobClient(file.name);
  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: file.type },
  });

  return blockBlobClient.url;
}

/**
 * Delete a file from Azure Blob Storage.
 */
export async function deleteFileFromAzure(fileUrl: string) {
    try {
      // Extract the file name from the URL
      const url = new URL(fileUrl);
      const fileName = url.pathname.split("/").pop(); // Get the last part of the path
  
      if (!fileName) {
        throw new Error("Invalid file URL. Could not extract file name.");
      }
  
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      const deleteResponse = await blockBlobClient.deleteIfExists();
  
      return {
        success: deleteResponse.succeeded,
        message: deleteResponse.succeeded
          ? `File '${fileName}' deleted successfully.`
          : `File '${fileName}' not found or already deleted.`,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Error deleting file: ${error.message}`,
      };
    }
  }
  