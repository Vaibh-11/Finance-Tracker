import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axios";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/getProfile");
      setUser(res.data.user);
      console.log(res.data.user);
    } catch (err) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/user/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold text-primary">
          💰 Finance Tracker
        </Link>
      </div>

      <div className="flex-none">
        <ul className="menu menu-horizontal gap-2 items-center">
          {user ? (
            <>
              <li>
                <Link to="/allTransactions">All Transactions</Link>
              </li>

              <li>
                <Link to="/profile">Profile</Link>
              </li>

              <li>
                <button className="btn btn-error btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="btn btn-primary btn-sm">
                  Login
                </Link>
              </li>

              <li>
                <Link to="/register" className="btn btn-outline btn-sm">
                  Signup
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
