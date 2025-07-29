const express = require("express");
const router = express.Router();
const { db } = require("../models/index.js");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  const shopId = req.query?.shopId;
  const dateBefore = req.query?.dateBefore; // date before should be like this: 2023-10-01T00:00:00.000Z
  const userId = req.query?.userId;

  try {
    const services = await db.Service.findAll({
      where: {
        ...(userId ? { userId } : {}),
        ...(shopId ? { shopId } : {}),
        ...(dateBefore ? { date: { [Op.lte]: dateBefore } } : {}),
      },

      include: [
        {
          model: db.User,
          attributes: [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone_number",
          ],
        },
        { model: db.Shop, attributes: ["id", "name", "location"] },
        { model: db.Car, attributes: ["id", "type", "model", "year", "color"] },
      ],
    });
    res.json(services);
  } catch (err) {
    console.error("Error fetching services:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch services due to " + err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newservice = await db.Service.create(req.body);
    res.status(201).json(newservice);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to create service", details: err.message });
  }
});

/*
{
        "type": "Brake Repair",
        "description": "Replace brake pads",
        "price": "199.99",
        "userId": 1,
        "shopId": 2,
        "carId": 2,
}
*/
module.exports = router;
