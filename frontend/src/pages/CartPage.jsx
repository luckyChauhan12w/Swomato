import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItemCard from "../components/CartItemCard";
function CartPage() {
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useSelector((state) => state.user);
  return (
    <div className="min-h-screen bg-[#fff9f6] flex justify-center py-8">
      <div className="w-full px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div
            className="p-2 rounded-full cursor-pointer transition"
            onClick={() => navigate("/")}
          >
            <IoIosArrowRoundBack size={30} className="text-gray-800" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Empty Cart */}
          {cartItems?.length === 0 ? (
            <p className="text-gray-500 text-center text-lg mt-20">
              Your Cart is Empty
            </p>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems?.map((item, index) => (
                  <CartItemCard data={item} key={index} />
                ))}
              </div>

              {/* Total Amount */}
              <div className="mt-6  p-5 rounded-2xl  flex justify-between items-center border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700">
                  Total Amount
                </h2>
                <span className="text-2xl font-bold text-black">
                  ₹{totalAmount}
                </span>
              </div>

              {/* Checkout Button */}
              <div className="mt-6 flex justify-end">
                <button
                  className="cursor-pointer bg-gradient-to-r from-[#ff5722] to-[#ff3d00] text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartPage;
