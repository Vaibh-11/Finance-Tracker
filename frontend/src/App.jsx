import React from "react";
import Body from "./components/Body";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import AllTransactions from "./components/AllTransaction";
import Profile from "./components/Profile";
import Register from "./components/Register";
import ForgetPassword from "./components/ForgetPassword";

const App = () => {
  return (
    <div>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/forgotPassword" element={<ForgetPassword />}></Route>
            <Route
              path="/allTransactions"
              element={<AllTransactions />}
            ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
