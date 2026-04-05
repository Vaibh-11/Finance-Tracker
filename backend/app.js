const express = require("express");
const app = express();
const connectDB = require("./config/database");
const userRouter = require("./routes/userRouter");
const transactionRouter = require("./routes/transactionRouter");
const cookie = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:4000",
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
