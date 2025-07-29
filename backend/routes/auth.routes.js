const express = require("express");
const router = express.Router();
const { db } = require("../models/index.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/signup", async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const hashedPassword = await bcrypt.hash(req.body.user.password, 10);
    const newUser = await db.User.create(
      { ...req.body.user, password: hashedPassword },
      { transaction: t }
    );

    if (req.body.user.is_mechanic === true) {
      const newshop = await db.Shop.create(
        { ...req.body.shop, adminId: newUser.id },
        { transaction: t }
      );
    }

    await t.commit();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    await t.rollback();
    res
      .status(500)
      .json({ error: "Failed to create user", details: err.message });
  }
});
/*

{
    "first_name": "Ahmid",
    "last_name": "Salmen",
    "phone_number": "92139213",
    "is_mechanic": false,
    "password": "zabr",
    "email": "zabri@zabri.zabri"
}
    */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("authorization", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: "Failed to login", details: err.message });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("authorization");
  res.json({ message: "Logout successful" });
});

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let shop = null;
    if (user.is_mechanic) {
      shop = await db.Shop.findOne({
        where: { adminId: user.id },
        attributes: ["id", "name", "location"],
      });
    }

    res.json({ ...user.toJSON(), shop });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve user", details: err.message });
  }
});

module.exports = router;
