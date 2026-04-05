import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import api from "../utils/axios";

const Body = () => {
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      await api.get("/user/profile");
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Body;
