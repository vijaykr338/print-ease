"use client";
import React from 'react';

interface PaymentButtonProps {
  amount: number;
  onSuccess: () => void;
}

export default function PaymentButton({ amount, onSuccess }: PaymentButtonProps) {
  const handlePayment = async () => {

    setTimeout(() => {
      console.log(`Order Summary: {pages} pages at 2 rupees per page`);
      onSuccess();
    }, 1000);
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
    >
      Pay {amount.toFixed(2)}
    </button>
  );
}