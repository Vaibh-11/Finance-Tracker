const Transaction = require("../models/transcationModel.js");
const mongoose = require("mongoose");

module.exports.addTransaction = async (req, res) => {
  try {
    const { type, description, amount } = req.body;

    if (!type) {
      return res.status(400).send("Type is required");
    }

    if (!["income", "expense"].includes(type.toLowerCase())) {
      return res.status(400).send("Invalid type");
    }

    if (!description) {
      return res.status(400).send("Description is required");
    }

    if (!amount || amount <= 0) {
      return res.status(400).send("Amount must be greater than 0");
    }

    const transaction = await Transaction.create({
      type,
      description,
      amount,
      userId: req.id,
    });

    res.status(201).json({
      message: "Transaction added successfully",
      transaction,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports.getTransactions = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 5,
      type,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    let filter = {
      userId: new mongoose.Types.ObjectId(req.id),
    };

    if (type) {
      filter.type = type;
    }

    // ✅ Amount range
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }

    // ✅ Date range
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // 🔥 Fetch transactions
    const transactions = await Transaction.find(filter)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: transactions,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
