import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
// import FileModel from "@/app/models/File"; // Adjust import path for your File model
// import PrintDoc from "@/app/models/PrintDoc"; // Adjust import path for your PrintDoc model
import axios from "axios";
import { Config } from "@/interfaces";
import { uploadFileToAzure } from "@/lib/server/utils";

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

    // Extract paymentId, userId, and storeId
    const paymentId = formData.get("paymentId") as string;
    const userId = formData.get("user_id") as string;
    const storeId = "1"

    if (!paymentId || !userId || !storeId) {
      return NextResponse.json(
        { error: "Missing required fields: paymentId, user_id, or store_id" },
        { status: 400 }
      );
    }

    const filesWithConfigs=extract_files(formData);

    if (filesWithConfigs.length === 0) {
      return NextResponse.json(
        { error: "No files or configurations provided" },
        { status: 400 }
      );
    }
    
    const uploadedFileIds: mongoose.Types.ObjectId[] = [];
    let cost=0;
    for (const { file, config } of filesWithConfigs) {
  
      console.log(`Uploading file: ${file.name} with config:`, config);
      const link = await uploadFileToAzure(file);
      cost += config.totalPrice;

      const url=process.env.NEXT_PUBLIC_BASE_URL+'/api/file';
      
      const file_create = await axios.post(url,{
        userId : userId,
        link:link,
        color:config.color,
        orientation : config.orientation,
        sided:config.sided,
        remarks:config.remarks,
        copies:config.copies,
        specificRange:config.specificRange,
        pagesToPrint :config.pagesToPrint,
      })
      uploadedFileIds.push(file_create.data.id);
      

      console.log(`Uploaded "${file.name}" successfully`);
    }

    // Create a new PrintDoc instance
    const printDoc_create = await axios.post((process.env.NEXT_PUBLIC_BASE_URL+"/api/printdoc"),{
      userID: userId,
      fileID: uploadedFileIds,
      storeID: "0001",
      status: "pending",
      type: "print",
      cost: cost,
      paymentId: paymentId,
    });
    
    console.log("printdoc instance created");
    

    return NextResponse.json(
      { message: "Files uploaded and PrintDoc created successfully" },
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


