import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";

import api from "../utils/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post(
        "/user/login",
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      navigate("/allTransactions");
    } catch (err) {
      setError(err?.response?.data);
    }
  };

  return (
    <div className="flex justify-center ">
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
              style={{
                border: "2px solid black",
                borderRadius: "3px",
                width: "100%",
              }}
              className="input p-3"
              type="email"
              value={email}
              placeholder="Enter your Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <br />

            <input
              style={{
                border: "2px solid black",
                borderRadius: "3px",
                width: "100%",
                marginTop: "30px",
              }}
              className="input p-3 mt-4"
              type="password"
              value={password}
              placeholder="Enter your Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <div className="card-actions justify-center mt-5"></div>
            <button className="btn btn-primary">Login</button>
          </form>
          <span className="flex justify-center" style={{ color: "red" }}>
            {error}
          </span>
          <div>
            <Link className="p-5" to="/register">
              New User? SignUp
            </Link>
            <Link className="p-5" to="/forgotPassword">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
