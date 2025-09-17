import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { serverUrl } from "../App";
import { Link } from "react-router-dom";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const handelSignIn = async (data) => {
    try {
      const res = await axios.post(`${serverUrl}/api/v1/auth/register`, data, {
        withCredentials: true,
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = (data) => {
    handelSignIn(data);
  };

  const handleGoogleLogin = () => {
    console.log("Google Login Clicked!");
    // yaha pe Google Auth logic aaega (Firebase / OAuth2)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-red-50 to-yellow-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-red-600 mb-2">
          🍔 Swomato
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Welcome back! Sign in to continue 🚀
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                  value: /^\S+@\S+$/i,
                  message: "Invalid email format",
                },
              })}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 
                         focus:ring-2 focus:ring-red-400 outline-none"
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 
                           focus:ring-2 focus:ring-red-400 outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot Password link */}
          <div className="text-right -mt-3">
            <Link
              to="/forget-password"
              className="text-sm text-red-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Sign In button */}
          <button
            type="submit"
            className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg 
                       hover:bg-red-600 transition duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 
                     rounded-lg py-2 font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <FcGoogle size={22} /> Login with Google
        </button>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-red-500 font-semibold hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
