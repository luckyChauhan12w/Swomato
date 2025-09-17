import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { serverUrl } from "../App";
import axios from "axios";

const Register = () => {
  const [googleUser, setGoogleUser] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Google Auth Flow
  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google User:", user);

      setGoogleUser({
        fullName: user.displayName || "",
        email: user.email || "",
      });
    } catch (error) {
      console.error("Google Auth Error:", error);
    }
  };

  const handleGoogleSubmit = async (data) => {
    try {
      const finalData = {
        fullName: googleUser?.fullName, // Firebase se
        email: googleUser?.email, // Firebase se
        mobile: data.mobile, // form se
        role: data.role, // form se
      };

      const res = await axios.post(
        `${serverUrl}/api/v1/auth/google-auth`,
        finalData
      );
      console.log("Google Response:", res.data);
    } catch (error) {
      console.error("Google Error:", error.response?.data || error.message);
    }
  };

  // Normal Register Flow

  const handleNormalRegister = async (data) => {
    try {
      const res = await axios.post(`${serverUrl}/api/v1/auth/register`, data);
      console.log("Register Response:", res.data);
    } catch (error) {
      console.error("Register Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-red-50 to-yellow-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-red-600 mb-2">
          🍔 Swomato
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Create your account & start ordering 🚀
        </p>

        {/* =============== NORMAL REGISTER FORM =============== */}
        {!googleUser && (
          <>
            <form
              onSubmit={handleSubmit(handleNormalRegister)}
              className="space-y-5"
            >
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  {...register("mobile", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter a valid 10-digit phone number",
                    },
                  })}
                  placeholder="Enter your phone number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none"
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm">
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Role
                </label>
                <select
                  {...register("role", { required: "Role is required" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="seller">Seller</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm">{errors.role.message}</p>
                )}
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition duration-200"
              >
                Register
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-2 text-gray-500 text-sm">OR</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* Google Auth Button */}
            <button
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <FcGoogle size={22} /> Continue with Google
            </button>
          </>
        )}

        {/* =============== GOOGLE EXTRA FIELDS =============== */}
        {googleUser && (
          <form
            onSubmit={handleSubmit(handleGoogleSubmit)}
            className="space-y-5"
          >
            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                {...register("mobile", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit phone number",
                  },
                })}
                placeholder="Enter your phone number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile.message}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Role
              </label>
              <select
                {...register("role", { required: "Role is required" })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="seller">Seller</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition duration-200"
            >
              Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
