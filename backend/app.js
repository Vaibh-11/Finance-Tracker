require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./config/database");
const userRouter = require("./routes/userRouter");
const transactionRouter = require("./routes/transactionRouter");
const cookie = require("cookie-parser");
const cors = require("cors");

const allowedOrigins = [
  "https://finance-tracker-lemon-eta.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
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

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/user", userRouter);
app.use("/transaction", transactionRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server Start Successfully on", PORT);
});

connectDB()
  .then(() => console.log("Database Connected Successfully"))
  .catch((err) => console.log("DB Error:", err));
