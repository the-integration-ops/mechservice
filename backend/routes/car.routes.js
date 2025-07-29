const express = require("express");
const router = express.Router();
const { db } = require("../models/index.js");

router.get("/", async (req, res) => {
  try {
    const cars = await db.Car.findAll();
    res.json(cars);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch cars due to " + err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCar = await db.Car.create(req.body);
    res.status(201).json(newCar);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to create car", details: err.message });
  }
});

module.exports = router;
