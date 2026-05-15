import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import axios from "axios";
import { Config } from "@/interfaces";
import { uploadFileToCloudinary } from "@/lib/server/utils";
import {auth} from "@/lib/auth"
import { createHash } from "crypto";

export const config = {
  api: {
    bodyParser: false, // Disable body parsing
  },
};

function extract_files(formData : FormData){
  const filesWithConfigs: Array<{ file: File; config: Config }> = [];
    formData.forEach((value, key) => {
      if (key.startsWith("file_")) {
        const index = key.split("_")[1];
        const file = value as File;
        const configKey = `config_${index}`;
        const config = formData.get(configKey);

        if (config) {
          filesWithConfigs.push({
            file,
            config: JSON.parse(config as string),
          });
        }
      }
    });
    return filesWithConfigs;
}
export async function POST(req: NextRequest) {
  try {
    // Parse FormData from the request
    const formData = await req.formData();
    
    const session = await auth();
    const user = session!.user;
    // console.log(user);
    
    
    // Extract userId (upload-first flow: do not require payment here)
    const userId = formData.get("user_id") as string;
    const storeId = "1";

    if (!userId || !storeId) {
      return NextResponse.json(
        { error: "Missing required field: user_id" },
        { status: 400 }
      );
    }

    const filesWithConfigs=extract_files(formData);
    const idempotencyKey = formData.get("idempotency_key") as string | null;

    if (filesWithConfigs.length === 0) {
      return NextResponse.json(
        { error: "No files or configurations provided" },
        { status: 400 }
      );
    }
    
    const uploadedFileIds: mongoose.Types.ObjectId[] = [];
    let cost=0;
    const origin = req.nextUrl.origin;
    const ttlHours = Number(process.env.UPLOADED_TTL_HOURS || "24");

    for (const { file, config } of filesWithConfigs) {

      console.log(`Uploading file: ${file.name} with config:`, config);

      // compute checksum
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const checksum = createHash('sha256').update(buffer).digest('hex');

      // upload
      const { url: link, publicId } = await uploadFileToCloudinary(file);
      cost += config.totalPrice;

      const expiresAt = new Date(Date.now() + ttlHours * 3600 * 1000).toISOString();

      const url = `${origin}/api/file`;

      const file_create = await axios.post(url,{
        userId : userId,
        link:link,
        publicId: publicId,
        idempotency_key: idempotencyKey || null,
        checksum: checksum,
        state: 'uploaded',
        uploadedAt: new Date().toISOString(),
        expiresAt: expiresAt,
        color:config.color,
        orientation : config.orientation,
        sided:config.sided,
        remarks:config.remarks,
        copies:config.copies,
        pageType:config.pageType,
        specificRange:config.specificRange,
        pagesToPrint :config.pagesToPrint,
      })
      uploadedFileIds.push(file_create.data.id);

      console.log(`Uploaded "${file.name}" successfully`);
    }

    // Return file ids and cost; client should initiate payment using these file IDs
    return NextResponse.json(
      { message: "Files uploaded successfully", fileIDs: uploadedFileIds, cost },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error uploading files or creating PrintDoc:", error);
    
    //CODE FOR REFUND GOES HERE
    return NextResponse.json(
      { error: "Failed to process the request", details: error.message },
      { status: 500 }
    );
  }
}


