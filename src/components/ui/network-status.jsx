// components/NetworkStatusBanner.tsx
import { useEffect, useState } from "react";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

export default function NetworkStatusBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnectBanner, setShowReconnectBanner] = useState(false);

  const checkInternetConnection = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      // Try fetching a reliable external resource
      await fetch("https://www.google.com/favicon.ico", {
        method: "HEAD",
        mode: "no-cors",
        signal: controller.signal,
      });

      clearTimeout(timeout);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const verifyConnection = async () => {
      const hasInternet = await checkInternetConnection();
      setIsOnline((prev) => {
        if (!prev && hasInternet) {
          setShowReconnectBanner(true);
          setTimeout(() => setShowReconnectBanner(false), 3000);
        }
        return hasInternet;
      });
    };

    verifyConnection(); // Initial check

    const interval = setInterval(() => {
      verifyConnection();
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 w-full bg-red-600 text-white flex items-center justify-center gap-2 p-3 z-50 shadow-md transition-all duration-500">
        <ExclamationTriangleIcon className="h-5 w-5 text-white" />
        <span>You are currently offline</span>
      </div>
    );
  }

  if (showReconnectBanner) {
    return (
      <div className="fixed top-0 left-0 w-full bg-green-600 text-white flex items-center justify-center gap-2 p-3 z-50 shadow-md transition-all duration-500">
        <CheckCircleIcon className="h-5 w-5 text-white" />
        <span>You are back online</span>
      </div>
    );
  }

  return null;
}
