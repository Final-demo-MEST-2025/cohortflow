import { useState, useEffect, useCallback } from "react";
import { WifiOff, Wifi, X, AlertTriangle } from "lucide-react";

const NetworkStatusMonitor = () => {
  const [isDeviceOnline, setIsDeviceOnline] = useState(navigator.onLine);
  const [isInternetReachable, setIsInternetReachable] = useState(true); // Assume true initially
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // The actual online status is only true when both device is online AND internet is reachable
  const isFullyOnline = isDeviceOnline && isInternetReachable;

  // Function to check actual internet connectivity
  const checkInternetConnection = useCallback(async () => {
    if (!navigator.onLine) {
      setIsInternetReachable(false);
      return;
    }

    // Prevent multiple simultaneous checks
    if (isChecking) return;

    setIsChecking(true);

    try {
      // Create a timestamp to prevent caching
      const timestamp = new Date().getTime();

      // Fetch a small resource from a reliable endpoint with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `https://www.gstatic.com/generate_204?_=${timestamp}`,
        {
          method: "HEAD",
          cache: "no-store",
          mode: "no-cors",
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      // If we get a response, internet is reachable
      const newIsReachable = response.status === 0 || response.status === 200;

      if (!isInternetReachable && newIsReachable) {
        // If we're transitioning to online
        setIsInternetReachable(true);
        setShowOnlineMessage(true);

        // Hide the online message after 3 seconds
        setTimeout(() => {
          setShowOnlineMessage(false);
        }, 3000);
      } else {
        setIsInternetReachable(newIsReachable);
      }
    } catch {
      // If fetch fails, there's no internet connection
      setIsInternetReachable(false);
    } finally {
      setIsChecking(false);
    }
  }, [isInternetReachable, isChecking]);

  useEffect(() => {
    // Initial check on component mount
    checkInternetConnection();

    // Function to handle device online/offline status changes
    const handleDeviceStatusChange = () => {
      const deviceOnline = navigator.onLine;
      setIsDeviceOnline(deviceOnline);

      if (deviceOnline) {
        // Check actual internet connectivity when device comes online
        checkInternetConnection();
      } else {
        // If device goes offline, we know internet isn't reachable
        setIsInternetReachable(false);
      }
    };

    // Add event listeners for device connectivity
    window.addEventListener("online", handleDeviceStatusChange);
    window.addEventListener("offline", handleDeviceStatusChange);

    // Set up periodic internet connectivity checks (every 15 seconds)
    const intervalId = setInterval(checkInternetConnection, 15000);

    // Cleanup function
    return () => {
      window.removeEventListener("online", handleDeviceStatusChange);
      window.removeEventListener("offline", handleDeviceStatusChange);
      clearInterval(intervalId);
    };
  }, [checkInternetConnection]);

  // Handle dismissal of the offline notification
  const dismissNotification = () => {
    if (!isFullyOnline) {
      // Just hide the notification without changing status
      // We'll force a re-check on dismissal
      checkInternetConnection();
    }
  };

  // If fully online and not showing transition message, don't render anything
  if (isFullyOnline && !showOnlineMessage) {
    return null;
  }

  // Define message text and icon based on conditions
  let statusMessage = "";
  let StatusIcon = null;

  if (!isDeviceOnline) {
    statusMessage = "You are currently offline";
    StatusIcon = WifiOff;
  } else if (!isInternetReachable) {
    statusMessage = "No internet connection available";
    StatusIcon = AlertTriangle;
  } else {
    statusMessage = "You're back online";
    StatusIcon = Wifi;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isFullyOnline ? "bg-green-600" : "bg-red-600"
      } ${
        isFullyOnline && !showOnlineMessage
          ? "opacity-0 -translate-y-full"
          : "opacity-100 translate-y-0"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white">
            <StatusIcon size={20} />
            <span className="font-medium">{statusMessage}</span>
          </div>
          {!isFullyOnline && (
            <button
              onClick={dismissNotification}
              className="text-white hover:text-gray-200 focus:outline-none"
              aria-label="Dismiss"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Create a provider component for easy global usage
export const NetworkStatusProvider = ({ children }) => {
  return (
    <>
      <NetworkStatusMonitor />
      {children}
    </>
  );
};

// Default export for direct usage
export default NetworkStatusMonitor;
