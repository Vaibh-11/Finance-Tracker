const express = require("express");
const app = express();
const connectDB = require("./config/database");
const userRouter = require("./routes/userRouter");
const transactionRouter = require("./routes/transactionRouter");
const cookie = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const allowedOrigins = [
  "https://finance-tracker-lemon-eta.vercel.app",
  "http://localhost:4000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookie());
app.use("/user", userRouter);
app.use("/transaction", transactionRouter);

connectDB()
  .then(() => {
    console.log("Database Connected Succesfully");
    app.listen(process.env.PORT, () => {
      console.log("Server Start Successfully");
    });
  })
  .catch((err) => {
    console.log("Error Successfully");
  });
