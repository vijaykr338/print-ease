import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { totalPrice } = await req.json();

    // Validate request body
    if (!totalPrice || typeof totalPrice !== "number") {
      return NextResponse.json({ error: "Invalid or missing totalPrice" }, { status: 400 });
    }

    const amount = totalPrice * 100; // Convert to paise
    const currency = "INR";

    // Create an order using Razorpay
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: true, // Automatically capture the payment
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    }, { status: 200 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Unable to create order" }, { status: 500 });
  }
}
