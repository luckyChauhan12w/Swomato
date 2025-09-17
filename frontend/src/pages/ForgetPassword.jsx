import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, KeyRound, Lock } from "lucide-react";

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (step === 1) {
      console.log("Step 1 → Email submitted:", data.email);
      // Call API to send OTP to email
      setStep(2);
    } else if (step === 2) {
      console.log("Step 2 → OTP entered:", data.otp);
      // Call API to verify OTP
      setStep(3);
    } else if (step === 3) {
      console.log("Step 3 → New Password:", data.password);
      // Call API to reset password
      alert("Password reset successful!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-red-500 mb-6">
          Swomato 🍴
        </h1>
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Enter OTP"}
          {step === 3 && "Create New Password"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Step 1: Email */}
          {step === 1 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-4">
                <Mail className="text-gray-400 w-5 h-5 mr-2" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full py-2 focus:outline-none"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          )}
          {/* Step 2: OTP */}
          {step === 2 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                OTP
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-4">
                <KeyRound className="text-gray-400 w-5 h-5 mr-2" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  {...register("otp", { required: "OTP is required" })}
                  className="w-full py-2 focus:outline-none"
                />
              </div>
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.otp.message}
                </p>
              )}
            </div>
          )}
          {/* Step 3: New Password */}
          {step === 3 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                New Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-4">
                <Lock className="text-gray-400 w-5 h-5 mr-2" />
                <input
                  type="password"
                  placeholder="Enter new password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full py-2 focus:outline-none"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-all"
          >
            {step === 1 && "Send OTP"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Reset Password"}
          </button>
        </form>

        {step === 1 && (
          <p className="text-sm text-gray-500 text-center mt-6">
            Remember your password?{" "}
            <a
              href="/signin"
              className="text-red-500 font-semibold hover:underline"
            >
              Sign In
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
