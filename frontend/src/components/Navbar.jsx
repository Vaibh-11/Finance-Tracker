import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../utils/authSlice";
import api from "../utils/axios";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/user/logout", {}, { withCredentials: true });

      dispatch(clearUser()); // ✅ update Redux
      navigate("/login");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gray-800 text-white shadow-md">
      {/* Logo / Title */}
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Finance Tracker
      </h1>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            {/* Welcome */}
            <span className="hidden sm:block">
              Hello, <span className="font-semibold">{user.username}</span>
            </span>

            {/* Links */}
            <Link to="/allTransactions" className="hover:underline">
              Dashboard
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Signup
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
