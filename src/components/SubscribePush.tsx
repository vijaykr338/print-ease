"use-client"

import { useEffect } from "react";
import axios from "axios";

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

export const SubscribePush = () => {
  useEffect(() => {
    const subscribe_to_push = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        return;
      }

      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        console.warn("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY; skipping push subscribe.");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const jsonsub = subscription.toJSON();
      await axios.post("/api/save_subscription", {
        pushSubscription: jsonsub,
        allowsNotification: true,
      });
    };

    subscribe_to_push();
  }, []);

  return null;
};