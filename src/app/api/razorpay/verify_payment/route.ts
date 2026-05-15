import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import axios from "axios";

const client = await clientPromise;
const db = client.db("PrintEase");
const PrintDocCollection = db.collection("PrintDoc");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userID, fileIDs, storeID, type, cost, email, idempotency_key } = body;

    // Validate request body
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userID || !fileIDs || !storeID || !type || !cost) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create expected signature using order_id and payment_id
    const hmac = crypto.createHmac("sha256", process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET!);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = hmac.digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    // Prevent duplicate processing by payment id or idempotency key
    const existing = await PrintDocCollection.findOne({ $or: [{ paymentId: razorpay_payment_id }, { idempotency_key: idempotency_key }] });
    if (existing) {
      return NextResponse.json({ success: true, id: existing._id, duplicate: true }, { status: 200 });
    }

    // Insert printdoc as paid and ready to queue
    const newPrintDoc = await PrintDocCollection.insertOne({
      userID: new ObjectId(userID),
      fileID: fileIDs.map((id: string) => new ObjectId(id)),
      storeID: storeID,
      state: 'paid',
      type: type,
      cost: cost,
      createdAt: new Date(),
      paymentId: razorpay_payment_id,
      idempotency_key: idempotency_key || null,
    });

    // notify user
    try{
      const origin = new URL(req.url).origin;
      await axios.post(`${origin}/api/notify-user`,{
        userEmail: email,
        title: "Payment received — your print job is queued",
        body: "We have received your payment and queued the job for printing."
      });
    }catch(e){
      console.warn("notify-user failed", e);
    }

    return NextResponse.json({ success: true, id: newPrintDoc.insertedId }, { status: 200 });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
