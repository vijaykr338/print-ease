import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    // Validate request body
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create expected signature using order_id and payment_id
    const hmac = crypto.createHmac("sha256", process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET!);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = hmac.digest("hex");

    if (expectedSignature === razorpay_signature) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
