import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

const client = await clientPromise;
const db = client.db("PrintEase");
const FileCollection = db.collection("File");

// GET: Fetch file details by ID

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
    }

    const file = await FileCollection.findOne({ _id: new ObjectId(id) });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json(file, { status: 200 });
  } catch (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT: Update file details by ID
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
    }

    const body = await req.json();
    const updatedFile = await FileCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );

    if (updatedFile.matchedCount === 0) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "File updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating file:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE: Remove a file by ID
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
    }

    const deletedFile = await FileCollection.deleteOne({ _id: new ObjectId(id) });

    if (deletedFile.deletedCount === 0) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "File deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
