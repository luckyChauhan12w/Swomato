import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import { FaUtensils, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import OwnerItemCard from "./ownerItemCard";

function OwnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { myShopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();

  // API call function - replace this with your actual API call
  const fetchOwnerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      setError("Failed to load shop data. Please try again.");
      console.error("Error fetching owner data:", err);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col">
        <Nav />
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center gap-4 p-8">
            <FaSpinner className="text-[#ff4d2d] w-12 h-12 animate-spin" />
            <p className="text-gray-600 text-lg">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col">
        <Nav />
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-xl shadow-lg max-w-md">
            <div className="text-red-500 text-5xl">⚠️</div>
            <p className="text-red-600 text-center">{error}</p>
            <button
              className="bg-[#ff4d2d] text-white px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200"
              onClick={fetchOwnerData}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main component content (same as before, but only renders after loading)
  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col items-center">
      <Nav />

      {!myShopData && (
        <div className="flex justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add Your Restaurant
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Join our food delivery platform and reach thousands of hungry
                customers every day.
              </p>
              <button
                className="bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200"
                onClick={() => navigate("/create-edit-shop")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {myShopData && (
        <div className="w-full flex flex-col items-center gap-6 px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl text-gray-900 flex items-center gap-3 mt-8 text-center">
            <FaUtensils className="text-[#ff4d2d] w-14 h-14" />
            Welcome to {myShopData.name}
          </h1>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300 w-full max-w-3xl relative">
            <div
              className="absolute top-4 right-4 bg-[#ff4d2d] text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition-colors cursor-pointer"
              onClick={() => navigate("/create-edit-shop")}
            >
              <FaPen size={20} />
            </div>
            <img
              src={myShopData.image}
              alt={myShopData.name}
              className="w-full h-48 sm:h-64 object-cover"
            />
            <div className="p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {myShopData.name}
              </h1>
              <p className="text-gray-500">
                {myShopData.city}, {myShopData.state}
              </p>
              <p className="text-gray-500 mb-4">{myShopData.address}</p>
            </div>
          </div>

          {myShopData.items.length === 0 && (
            <div className="flex justify-center items-center p-4 sm:p-6">
              <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col items-center text-center">
                  <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    Add Your Food Item
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    Share your delicious creations with our customers by adding
                    them to the menu.
                  </p>
                  <button
                    className="bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200"
                    onClick={() => navigate("/add-item")}
                  >
                    Add Food
                  </button>
                </div>
              </div>
            </div>
          )}

          {myShopData.items.length > 0 && (
            <div className="flex flex-col items-center gap-4 w-full max-w-3xl">
              {myShopData.items.map((item, index) => (
                <OwnerItemCard data={item} key={item.id || index} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;
