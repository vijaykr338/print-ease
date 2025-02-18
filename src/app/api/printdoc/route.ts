
import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import Razorpay from "razorpay"

const client = await clientPromise;
const db = client.db("PrintEase");
const PrintDocCollection = db.collection("PrintDoc");

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request body
    if (!body.userID || !body.fileID || !body.storeID || !body.status || !body.type || !body.cost || !body.paymentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    //verify payment ID
    // const instance = new Razorpay({ key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET!})
    // console.log("here it comess------------");
    
    // const res=await instance.payments.fetch(body.paymentId);
    // console.log(res);
    
    // Insert into database
    const newPrintDoc = await PrintDocCollection.insertOne({
      userID: new ObjectId(body.userID),
      fileID: body.fileID.map((id: string) => new ObjectId(id)),
      storeID:body.storeID,
      status: body.status,
      type: body.type,
      cost: body.cost,
      createdAt: new Date(),
      paymentId: body.paymentId,
    });

    return NextResponse.json({ message: "PrintDoc created successfully", id: newPrintDoc.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error creating PrintDoc:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req:Request){
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");
    console.log("user id",user_id);
    if(!user_id){
      return NextResponse.json(
        {message:"User ID not provided"},
        {status:400}
      )
    }
    try{
      if(!ObjectId.isValid(user_id)){
        return NextResponse.json(
          {message:"Not a vlid user id"},
          {status:500}
        )
      }
      const data = await PrintDocCollection.find({userID :new ObjectId(user_id)}).sort({createdAt:-1}).toArray();
      return NextResponse.json(data,{status:200});
    }
    catch(e:any){
      console.log(e.message);
      
      return NextResponse.json(
        {message:`Some error occured finding the printdoc with userid ${user_id}`},
        {status:500}
      )
    }
}
