import React from "react";
import Body from "./components/Body";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import AllTransactions from "./components/AllTransaction";
import Profile from "./components/Profile";
import Register from "./components/Register";
import ForgetPassword from "./components/ForgetPassword";
import { Provider } from "react-redux";
import store from "./utils/store";

const App = () => {
  return (
    <div>
      <Provider store={store}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route
                path="/forgotPassword"
                element={<ForgetPassword />}
              ></Route>
              <Route
                path="/allTransactions"
                element={<AllTransactions />}
              ></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
};

export default App;
