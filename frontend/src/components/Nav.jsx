import React, { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { serverUrl } from "../App";
import { setSearchItems, setUserData } from "../redux/userSlice";
import { FaPlus } from "react-icons/fa6";
import { TbReceipt2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

function Nav() {
  const { userData, currentCity, cartItems } = useSelector(
    (state) => state.user
  );
  const { myShopData } = useSelector((state) => state.owner);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      if (result.status === 200) {
        dispatch(setUserData(null));
        navigate("/"); // Navigate to home page after logout
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearchItems = async () => {
    if (!query.trim()) {
      dispatch(setSearchItems(null));
      return;
    }

    try {
      const result = await axios.get(
        `${serverUrl}/api/item/search-items?query=${encodeURIComponent(
          query
        )}&city=${encodeURIComponent(currentCity)}`,
        { withCredentials: true }
      );
      dispatch(setSearchItems(result.data));
    } catch (error) {
      console.error("Search error:", error);
      dispatch(setSearchItems(null));
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setShowInfo(false);
        setShowSearch(false);
      }
    };

    if (showInfo || showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInfo, showSearch]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim()) {
        handleSearchItems();
      } else {
        dispatch(setSearchItems(null));
      }
    }, 300); // Add debouncing for better performance

    return () => clearTimeout(delayedSearch);
  }, [query, currentCity]); // Add currentCity as dependency

  // Early return if userData is not available
  if (!userData) {
    return (
      <div className="w-full h-[80px] flex items-center justify-center px-6 fixed top-0 z-[9999] bg-[#fff9f6] shadow-md">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[80px] flex items-center justify-between px-6 fixed top-0 z-[9999] bg-[#fff9f6] ">
      {/* Logo */}
      <h1
        className="text-3xl font-bold text-[#ff4d2d] cursor-pointer select-none"
        onClick={() => navigate("/")}
      >
        Swomato
      </h1>

      {/* Search Bar */}
      {userData.role === "user" && (
        <div className="flex-1 mx-6 relative dropdown-container">
          {/* Mobile search */}
          {showSearch && (
            <div className="md:hidden absolute top-[90px] left-1/2 -translate-x-1/2 w-[90%] bg-white shadow-xl rounded-xl flex items-center gap-3 p-3 z-[10000]">
              <div className="flex items-center gap-2 w-[30%] border-r border-gray-300 px-2">
                <FaLocationDot size={22} className="text-[#ff4d2d]" />
                <span className="truncate text-gray-600">
                  {currentCity || "Select City"}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <IoIosSearch size={22} className="text-[#ff4d2d]" />
                <input
                  type="text"
                  placeholder="Discover yummy meals..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full outline-none text-gray-700 px-2 py-1 rounded-md  placeholder-gray-400"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Desktop search */}
          <div className="hidden md:flex w-full h-[60px] items-center px-4 gap-3">
            <div className="flex items-center w-[30%] gap-2 border-r border-gray-300 pr-2">
              <FaLocationDot size={22} className="text-[#ff4d2d]" />
              <span className="truncate text-gray-600">
                {currentCity || "Select City"}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <IoIosSearch size={22} className="text-[#ff4d2d]" />
              <input
                type="text"
                placeholder="Discover yummy meals..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full outline-none text-gray-700 px-2 py-1 rounded-md placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* Icons / Buttons */}
      <div className="flex items-center gap-4">
        {/* Mobile search toggle */}
        {userData.role === "user" && (
          <button
            className="md:hidden text-[#ff4d2d] p-2 hover:bg-[#ff4d2d]/10 rounded-lg transition"
            onClick={() => setShowSearch((prev) => !prev)}
            aria-label={showSearch ? "Close search" : "Open search"}
          >
            {showSearch ? <RxCross2 size={25} /> : <IoIosSearch size={25} />}
          </button>
        )}

        {/* Role-specific buttons */}
        {userData.role === "owner" && myShopData && (
          <>
            <button
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium hover:bg-[#ff4d2d]/20 transition"
              onClick={() => navigate("/add-item")}
              aria-label="Add Item"
            >
              <FaPlus size={18} />
              <span>Add Item</span>
            </button>
            <button
              className="md:hidden flex items-center px-3 py-2 rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d] hover:bg-[#ff4d2d]/20 transition"
              onClick={() => navigate("/add-item")}
              aria-label="Add Item"
            >
              <FaPlus size={18} />
            </button>
            <button
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium hover:bg-[#ff4d2d]/20 transition"
              onClick={() => navigate("/my-orders")}
              aria-label="My Orders"
            >
              <TbReceipt2 size={20} />
              My Orders
            </button>
            <button
              className="md:hidden flex items-center px-3 py-2 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium hover:bg-[#ff4d2d]/20 transition"
              onClick={() => navigate("/my-orders")}
              aria-label="My Orders"
            >
              <TbReceipt2 size={20} />
            </button>
          </>
        )}

        {/* User buttons */}
        {userData.role === "user" && (
          <>
            <div
              className="relative cursor-pointer p-2 rounded-lg transition"
              onClick={() => navigate("/cart")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate("/cart");
                }
              }}
              aria-label={`Shopping cart with ${cartItems?.length || 0} items`}
            >
              <FiShoppingCart size={25} className="text-[#ff4d2d]" />
              {cartItems && cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 text-[12px] bg-[#ff4d2d] text-white rounded-full flex items-center justify-center">
                  {cartItems.length > 99 ? "99+" : cartItems.length}
                </span>
              )}
            </div>
            <button
              className="hidden md:block px-3 py-2 rounded-lg cursor-pointer hover:text-[#ff4d2d] text-[#4A5565] font-medium  transition"
              onClick={() => navigate("/my-orders")}
            >
              My Orders
            </button>
          </>
        )}

        {/* Profile */}
        <div className="relative dropdown-container">
          <div
            className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-[#ff4d2d] border-2 font-semibold cursor-pointer   transition-transform"
            onClick={() => setShowInfo((prev) => !prev)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setShowInfo((prev) => !prev);
              }
            }}
            aria-label="Profile menu"
          >
            {userData?.fullName
              ? userData.fullName.charAt(0).toUpperCase()
              : "U"}
          </div>

          {/* Profile Dropdown */}
          {showInfo && (
            <div className="fixed top-[90px] right-5 md:right-[8%] lg:right-[2%] w-[220px] bg-white/95 backdrop-blur-md shadow-lg border border-gray-100 rounded-2xl p-4 flex flex-col gap-3 z-[10000] transition-all duration-200">
              <span className="font-semibold text-gray-800">
                {userData.fullName || "User"}
              </span>
              <span className="text-sm text-gray-500">
                {userData.role === "owner" ? "Restaurant Owner" : "Customer"}
              </span>
              {userData.role === "user" && (
                <button
                  className="text-[#ff4d2d] cursor-pointer md:hidden hover:underline text-left"
                  onClick={() => {
                    navigate("/my-orders");
                    setShowInfo(false);
                  }}
                >
                  My Orders
                </button>
              )}
              <button
                className="text-[#ff4d2d] cursor-pointer hover:underline text-left"
                onClick={() => {
                  handleLogOut();
                  setShowInfo(false);
                }}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;
