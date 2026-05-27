"use strict";
"use client";

import { useEffect } from "react";

export function RegisterSW() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service worker registered with scope: ", registration.scope);
        })
        .catch((err) => {
          console.error("Service worker registration failed: ", err);
        });
    }
  }, []);

  return null;
}
