import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
} from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";

function useGetCity() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const apiKey = import.meta.env.VITE_GEOAPIKEY;

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    const getCurrentLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          });
        });

        // console.log(position);
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Update location in Redux
        dispatch(setLocation({ lat: latitude, lon: longitude }));

        // Get address information
        const result = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
        );

        const locationData = result?.data?.results?.[0];

        if (locationData) {
          // Dispatch only serializable data (strings, numbers, etc.)
          dispatch(
            setCurrentCity(
              locationData.city || locationData.county || "Unknown City"
            )
          );
          dispatch(setCurrentState(locationData.state || "Unknown State"));
          dispatch(
            setCurrentAddress(
              locationData.address_line2 ||
                locationData.address_line1 ||
                "Unknown Address"
            )
          );
          dispatch(
            setAddress(
              locationData.address_line2 || locationData.address_line1 || ""
            )
          );
        }
      } catch (error) {
        console.error("Error getting location or address:", error);

        // Handle specific geolocation errors
        if (error.code) {
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
        }
      }
    };

    getCurrentLocation();
  }, []); // Remove userData from dependencies to prevent unnecessary runs

  // Optional: return a function to manually refresh location
  const refreshLocation = async () => {
    // Re-run the location fetching logic
    // Implementation similar to above if needed
  };

  return { refreshLocation };
}

export default useGetCity;
