const express = require("express");
const router = express.Router();
const {
  addTransaction,
  getTransactions,
} = require("../controllers/transaction");
const { authentication } = require("../middleware/auth");

router.route("/add").post(authentication, addTransaction);
router.route("/getTransaction").get(authentication, getTransactions);

module.exports = router;
