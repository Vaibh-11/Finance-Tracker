import React, { useState } from "react";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await api.post("/user/forgot-password", { email });
      setMessage(res.data);
      setStep(2);
    } catch (err) {
      setError(err.response?.data || "Error sending OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await api.post("/user/reset-password", {
        email,
        otp,
        newPassword,
      });

      setMessage(res.data);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data || "Error resetting password");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center text-primary">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h2>

          {message && (
            <p className="text-green-500 text-center text-sm">{message}</p>
          )}

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4 mt-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button className="btn btn-primary w-full">Send OTP</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
              <input
                type="text"
                placeholder="Enter OTP"
                className="input input-bordered w-full"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Enter New Password"
                className="input input-bordered w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <button className="btn btn-success w-full">Reset Password</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
