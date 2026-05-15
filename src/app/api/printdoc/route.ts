import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { generate_otp } from "@/utils/generate_otp";
import axios from "axios";
import {auth} from "@/lib/auth"

const client = await clientPromise;
const db = client.db("PrintEase");
const PrintDocCollection = db.collection("PrintDoc");

export async function POST(req: Request) {
  try {
    const body = await req.json();
  
    
    
    // Validate request body
    const incomingState = body.state || body.status;
    if (!body.userID || !body.fileID || !body.storeID || !incomingState || !body.type || !body.cost || !body.paymentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if(!body.email){
      console.log("user email not found");
    }
    console.log(body.email);
    
    //verify payment ID
    // const instance = new Razorpay({ key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET!})
    // console.log("here it comess------------");
    
    // const res=await instance.payments.fetch(body.paymentId);
    // console.log(res);
    const otp = await generate_otp();
    console.log("otp generated is:" , otp);
    
    // Insert into database
    const newPrintDoc = await PrintDocCollection.insertOne({
      userID: new ObjectId(body.userID),
      fileID: body.fileID.map((id: string) => new ObjectId(id)),
      storeID:body.storeID,
      state: incomingState,
      type: body.type,
      cost: body.cost,
      createdAt: new Date(),
      paymentId: body.paymentId,
      otp:otp
    });
    

    
    const origin = new URL(req.url).origin;
    const notification_res = await axios.post(`${origin}/api/notify-user`,{
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
    //notify user that it is completed uploading
    
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
