import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/getProfile");
      setUser(res.data.user);
    } catch (err) {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      await api.post("/user/change", passwords);
      alert("Password updated successfully");
      setPasswords({ oldPassword: "", newPassword: "" });
      setShowPasswordForm(false);
    } catch (err) {
      alert(err.response?.data || "Error updating password");
    }
  };

  const handleLogout = async () => {
    await api.post("/user/logout");
    navigate("/login");
  };

  if (!user) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">Profile</h2>

          <div>
            <label className="font-semibold">Username</label>
            <p className="border p-2 rounded mt-1">{user.username}</p>
          </div>

          <div className="mt-3">
            <label className="font-semibold">Email</label>
            <p className="border p-2 rounded mt-1">{user.email}</p>
          </div>

          <div className="mt-3">
            <label className="font-semibold">Password</label>
            <p className="border p-2 rounded mt-1">********</p>
          </div>

          <div className="flex gap-3 mt-5 justify-center">
            <button
              className="btn btn-primary"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              Change Password
            </button>

            <button className="btn btn-error" onClick={handleLogout}>
              Logout
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="mt-5 space-y-3">
              <input
                type="password"
                placeholder="Old Password"
                className="input input-bordered w-full"
                value={passwords.oldPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    oldPassword: e.target.value,
                  })
                }
                required
              />

              <input
                type="password"
                placeholder="New Password"
                className="input input-bordered w-full"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    newPassword: e.target.value,
                  })
                }
                required
              />

              <button className="btn btn-success w-full">
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
