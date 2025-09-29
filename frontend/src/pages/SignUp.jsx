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

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { fullName, email, password, mobile, role },
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
    if (!mobile) return setErr("Mobile number is required");
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          role,
          mobile,
        },
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
            Join us to enjoy delicious food delivered fast at your doorstep!
          </p>
          <img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80"
            alt="food"
            className="rounded-xl shadow-lg"
          />
        </div>

        {/* Right Form Column */}
        <div className="md:w-2/5 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Create Account
          </h2>

          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
          />

          {/* Mobile */}
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
          />

          {/* Password */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 pr-12 transition duration-300"
            />
            <button
              className="absolute right-3 top-3 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>

          {/* Role Selection */}
          <div className="flex gap-3 mb-6">
            {["user", "owner", "deliveryBoy"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-xl font-medium transition duration-300 ${
                  role === r
                    ? "bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg transform"
                    : "border border-orange-400 text-orange-500 hover:bg-orange-50"
                } cursor-pointer`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Sign Up Button */}
          <button
            className="w-full py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-xl font-semibold   flex justify-center items-center cursor-pointer"
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Sign Up"}
          </button>
          {err && <p className="text-red-500 text-center mt-2">{err}</p>}

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleAuth}
            className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3 hover:bg-gray-100 transition duration-300 cursor-pointer"
          >
            <FcGoogle size={20} />
            <span>Sign up with Google</span>
          </button>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <span
              className="text-orange-500 cursor-pointer hover:underline"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
