import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

const Register = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/user/signup", form);
      setStep(2);
    } catch (err) {
      setError(err.response?.data || "Error sending OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/user/verify-otp", {
        email: form.email,
        otp,
      });

      alert("Signup successful");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center text-primary">
            {step === 1 ? "Register" : "Verify OTP"}
          </h2>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          {step === 1 && (
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="input input-bordered w-full"
                value={form.username}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered w-full"
                value={form.email}
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input input-bordered w-full"
                value={form.password}
                onChange={handleChange}
                required
              />

              <button className="btn btn-primary w-full">Send OTP</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 mt-4">
              <input
                type="text"
                placeholder="Enter OTP"
                className="input input-bordered w-full"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />

              <button className="btn btn-success w-full">Verify OTP</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
