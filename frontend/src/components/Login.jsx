import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../utils/authSlice";
import "../index.css";
import api from "../utils/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const response = await api.post(
        "/user/login",
        { email, password },
        { withCredentials: true },
      );

      dispatch(setUser(response.data));
      navigate("/allTransactions");
    } catch (err) {
      setError(err?.response?.data || "Login failed");
    }
  };

  return (
    <div className="flex justify-center">
      <div className="card card-border bg-base-300 w-96 mt-5">
        <div className="card-body">
          <h2 className="card-title justify-center">Login Form</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="p-3 mt-5"
          >
            <input
              className="input p-3"
              style={{
                border: "2px solid black",
                borderRadius: "3px",
                width: "100%",
              }}
              type="email"
              value={email}
              placeholder="Enter your Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="input p-3 mt-6"
              style={{
                border: "2px solid black",
                borderRadius: "3px",
                width: "100%",
              }}
              type="password"
              value={password}
              placeholder="Enter your Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="card-actions justify-center mt-5">
              <button className="btn btn-primary w-full">Login</button>
            </div>
          </form>

          {/* Error */}
          <span className="flex justify-center text-red-500">{error}</span>

          {/* Links */}
          <div className="flex justify-between mt-4">
            <Link to="/register">New User? SignUp</Link>
            <Link to="/forgotPassword">Forgot Password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
