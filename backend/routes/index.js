const routes = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware.js");
const authRoutes = require("./auth.routes.js");
const carRoutes = require("./car.routes.js");
const shopRoutes = require("./shop.routes.js");
const serviceRoutes = require("./service.routes.js");
const userCarRoutes = require("./userCar.routes.js");
const userRoutes = require("./user.routes.js");

routes.use("/auth", authRoutes);
routes.use("/users", authMiddleware, userRoutes);
routes.use("/cars", authMiddleware, carRoutes);
routes.use("/shops", authMiddleware, shopRoutes);
routes.use("/services", authMiddleware, serviceRoutes);
routes.use("/user-cars", authMiddleware, userCarRoutes);

module.exports = routes;
