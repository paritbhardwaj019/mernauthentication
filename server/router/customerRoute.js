const express = require("express");
const router = express.Router();
const Customer = require("../models/customerModal");
const auth = require("../middlewares/auth");

router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;
    const newCustomer = new Customer({ name });
    const saveCustomer = newCustomer.save();

    res.status(200).json(saveCustomer);
  } catch (error) {
    res.status(500).json({ message: "Failure", errorMessage: error.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Failure", errorMessage: error.message });
  }
});

module.exports = router;
