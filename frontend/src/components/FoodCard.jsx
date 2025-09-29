import React, { useState } from "react";
import { FaLeaf } from "react-icons/fa";
import { FaDrumstickBite } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";

function FoodCard({ data }) {
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.user);
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500 text-lg" />
        ) : (
          <FaRegStar key={i} className="text-yellow-500 text-lg" />
        )
      );
    }
    return stars;
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
  };
  const handleDecrease = () => {
    if (quantity > 0) {
      const newQty = quantity - 1;
      setQuantity(newQty);
    }
  };

  return (
    <div className="w-[260px] bg-white rounded-sm border border-orange-100 shadow-md cursor-pointer flex flex-col overflow-hidden">
      {/* Image Section */}
      <div className="relative w-full h-[180px] overflow-hidden">
        {/* Food type badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
          {data.foodType === "veg" ? (
            <FaLeaf className="text-green-600 text-lg" />
          ) : (
            <FaDrumstickBite className="text-red-600 text-lg" />
          )}
        </div>

        {/* Image */}
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Subtle gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-5">
        {/* Title */}
        <h2 className="font-semibold text-gray-900 text-lg truncate">
          {data.name}
        </h2>

        {/* Ratings */}
        <div className="flex items-center gap-2 mt-2">
          {renderStars(data.rating?.average || 0)}
          <span className="text-xs text-gray-500">
            ({data.rating?.count || 0})
          </span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-4">
          <span className="font-semibold text-black text-xl">
            ₹{data.price}
          </span>

          <div className="flex items-center gap-2">
            {/* Quantity selector */}
            <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
              <button
                className="px-2 py-1 cursor-pointer hover:bg-gray-100 transition"
                onClick={handleDecrease}
              >
                <FaMinus size={12} />
              </button>
              <span className="px-2 text-sm">{quantity}</span>
              <button
                className="px-2 py-1 cursor-pointer hover:bg-gray-100 transition"
                onClick={handleIncrease}
              >
                <FaPlus size={12} />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              className="rounded-full cursor-pointer  px-4 py-2"
              onClick={() => {
                if (quantity > 0) {
                  dispatch(
                    addToCart({
                      id: data._id,
                      name: data.name,
                      price: data.price,
                      image: data.image,
                      shop: data.shop,
                      quantity,
                      foodType: data.foodType,
                    })
                  );
                }
              }}
            >
              <FaShoppingCart
                size={18}
                className={`transition-colors duration-300 cursor-pointer ${
                  cartItems.some((i) => i.id === data._id)
                    ? "text-orange-500"
                    : "text-gray-500"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
