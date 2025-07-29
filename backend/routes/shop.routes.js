const express = require("express");
const router = express.Router();
const { db } = require("../models/index.js");

router.get("/", async (req, res) => {
  try {
    const shops = await db.Shop.findAll({
      include: [
        {
          model: db.User,
          as: "admin",
          attributes: ["id", "first_name", "last_name", "email"],
        },
      ],
    });
    res.json(shops);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch shops due to " + err.message });
  }
});

module.exports = router;
