const express = require("express");
const router = express.Router();
const { db } = require("../models/index.js");

router.get("/", async (req, res) => {
  try {
    const userCars = await db.UserCar.findAll();
    res.json(userCars);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch userCars due to " + err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCar = await db.UserCar.create(req.body);
    res.status(201).json(newCar);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to create userCar", details: err.message });
  }
});

module.exports = router;
