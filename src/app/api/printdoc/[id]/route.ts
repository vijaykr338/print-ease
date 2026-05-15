import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { deleteFileFromCloudinary } from "@/lib/server/utils";
import axios from "axios";

// GET: Fetch PrintDoc by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const client = await clientPromise;
    const db = client.db("PrintEase");
    const PrintDocCollection = db.collection("PrintDoc");

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid PrintDoc ID" }, { status: 400 });
    }

    const printDoc = await PrintDocCollection.findOne({ _id: new ObjectId(id) });

    if (!printDoc) {
      return NextResponse.json({ error: "PrintDoc not found" }, { status: 404 });
    }

    return NextResponse.json(printDoc, { status: 200 });
  } catch (error) {
    console.error("Error fetching PrintDoc:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT: Update PrintDoc by ID
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const client = await clientPromise;
    const db = client.db("PrintEase");
    const PrintDocCollection = db.collection("PrintDoc");

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid PrintDoc ID" }, { status: 400 });
    }

    const body = await req.json();
    const updatedPrintDoc = await PrintDocCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );

    if (updatedPrintDoc.matchedCount === 0) {
      return NextResponse.json({ error: "PrintDoc not found" }, { status: 404 });
    }

    const notification_res = await axios.post(process.env.NEXT_PUBLIC_BASE_URL+"/api/notify-user",{
      userEmail:body.email,
      title:"Your print job is added to the queue",
      body: "You will be notified when the job is done"
    });
    if(notification_res.status == 500){
      console.log("kuch err aagya notification bhejne me");
      console.log(notification_res.data);
    }
    else{
      console.log("notification chli gyi yayyyy");

    }

    return NextResponse.json({ message: "PrintDoc updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating PrintDoc:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE: Remove PrintDoc and associated Files by ID
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const client = await clientPromise;
    const db = client.db("PrintEase");
    const PrintDocCollection = db.collection("PrintDoc");
    const FileCollection = db.collection("File");

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid PrintDoc ID" }, { status: 400 });
    }

    // Find the PrintDoc to get associated file IDs
    const printDoc = await PrintDocCollection.findOne({ _id: new ObjectId(id) });

    if (!printDoc) {
      return NextResponse.json({ error: "PrintDoc not found" }, { status: 404 });
    }

    // Delete associated files
    for (const fileId of printDoc.fileID) {
      const fileDoc = await FileCollection.findOne({ _id: fileId });
      if (fileDoc?.publicId) {
        await deleteFileFromCloudinary(fileDoc.publicId);
      }
    }
    await FileCollection.deleteMany({ _id: { $in: printDoc.fileID } });

    // Delete the PrintDoc itself
    const deletedPrintDoc = await PrintDocCollection.deleteOne({ _id: new ObjectId(id) });

    if (deletedPrintDoc.deletedCount === 0) {
      return NextResponse.json({ error: "Failed to delete PrintDoc" }, { status: 400 });
    }

    return NextResponse.json({ message: "PrintDoc and associated files deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting PrintDoc:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
