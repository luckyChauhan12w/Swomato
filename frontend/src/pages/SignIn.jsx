import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      setErr("");
      setLoading(false);
    } catch (error) {
      setErr(error?.response?.data?.message || "Something went wrong!");
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        { email: result.user.email },
        { withCredentials: true }
      );
      dispatch(setUserData(data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-50 to-red-50 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl shadow-2xl rounded-2xl overflow-hidden bg-white">
        {/* Left Branding Column */}
        <div className="md:w-3/5 p-8 flex flex-col justify-center items-center text-center bg-gradient-to-br from-orange-400 to-red-500 text-white">
          <h1 className="text-5xl font-extrabold mb-6 tracking-wide">
            Swomato
          </h1>
          <p className="mb-8 text-lg font-medium">
            Sign in to enjoy delicious food delivered fast at your doorstep!
          </p>
          <img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80"
            alt="food"
            className="rounded-xl shadow-lg"
          />
        </div>

        {/* Right Form Column */}
        <div className="md:w-2/5 p-8">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Sign In</h2>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                />
                <button
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div
              className="text-right mb-4 text-orange-500 font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </div>

            {/* Sign In Button */}
            <button
              className="w-full py-3 mb-2 font-semibold rounded-xl text-white bg-gradient-to-r from-orange-400 to-red-500 flex justify-center items-center cursor-pointer"
              onClick={handleSignIn}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Sign In"}
            </button>
            {err && <p className="text-red-500 text-center my-2">*{err}</p>}

            {/* Google Sign In */}
            <button
              onClick={handleGoogleAuth}
              className="w-full mt-3 flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3 hover:bg-gray-100 transition duration-300 cursor-pointer"
            >
              <FcGoogle size={20} />
              <span>Sign In with Google</span>
            </button>

            {/* Sign Up Link */}
            <p className="text-center mt-6">
              Want to create a new account?{" "}
              <span
                className="text-orange-500 font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
