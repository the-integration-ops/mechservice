const express = require("express");
const router = express.Router();
const { db } = require("../models/index.js");

router.get("/", async (req, res) => {
  try {
    const isMechanic = req.query.is_mechanic;
    // If is_mechanic is not provided, return all users

    const users = await db.User.findAll({
      where:
        isMechanic !== undefined ? { is_mechanic: isMechanic === "true" } : {},
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch users due to " + err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: db.Car,
          through: { attributes: [] },
          attributes: ["id", "type", "model", "year", "color"],
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch user due to " + err.message });
  }
});

module.exports = router;
