import axios from "axios";
import { useEffect, useRef } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setLocation } from "../redux/mapSlice";

function useUpdateLocation() {
  const dispatch = useDispatch();
  const watchIdRef = useRef(null);

  useEffect(() => {
    const updateLocation = async (lat, lon) => {
      try {
        const result = await axios.post(
          `${serverUrl}/api/user/update-location`,
          { lat, lon },
          { withCredentials: true }
        );

        // Handle the response if needed
        // console.log("Location updated:", result.data);

        // Update Redux state if needed
        dispatch(setLocation({ lat, lon }));
      } catch (error) {
        console.error("Error updating location:", error);
      }
    };

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    // Set up position watching with error handling
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        updateLocation(pos.coords.latitude, pos.coords.longitude);
      },
      (error) => {
        console.error("Geolocation error:", error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.error("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            console.error("The request to get user location timed out.");
            break;
          default:
            console.error("An unknown error occurred.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );

    // Cleanup function to clear the watch when component unmounts
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [dispatch]); // Remove userData from dependencies to prevent unnecessary re-runs

  // Optional: Return a function to manually trigger location update
  const triggerLocationUpdate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updateLocation(pos.coords.latitude, pos.coords.longitude);
        },
        (error) => {
          console.error("Manual location update failed:", error);
        }
      );
    }
  };

  return { triggerLocationUpdate };
}

export default useUpdateLocation;
