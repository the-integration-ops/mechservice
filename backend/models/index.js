const { Sequelize } = require("sequelize");
require("dotenv").config();

const tempSequelize = new Sequelize(
  "",
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

const db = {};

async function initializeDB() {
  try {
    await tempSequelize.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
    );
    // await tempSequelize.query(`DROP DATABASE \`${process.env.DB_NAME}\`;`);
    await tempSequelize.close();
    const sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false,
      }
    );
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    // Model definision:
    db.User = require("./user.model.js")(sequelize);
    db.Car = require("./car.model.js")(sequelize);
    db.UserCar = require("./userCar.model.js")(sequelize);
    db.Shop = require("./shop.model.js")(sequelize);
    db.Service = require("./service.model.js")(sequelize);

    // Relationships:

    db.User.belongsToMany(db.Car, {
      through: db.UserCar,
      foreignKey: "userId",
    });
    db.Car.belongsToMany(db.User, { through: db.UserCar, foreignKey: "carId" });

    db.Shop.belongsTo(db.User, { as: "admin", foreignKey: "adminId" });
    db.User.hasMany(db.Shop, { foreignKey: "adminId" });

    db.Service.belongsTo(db.User, { foreignKey: "userId" });
    db.User.hasMany(db.Service, { foreignKey: "userId" });

    db.Service.belongsTo(db.Shop, { foreignKey: "shopId" });
    db.Shop.hasMany(db.Service, { foreignKey: "shopId" });

    db.Service.belongsTo(db.Car, { foreignKey: "carId" });
    db.Car.hasMany(db.Service, { foreignKey: "carId" });

    // await sequelize.sync({ force: true });

    console.log("DB connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

module.exports = {
  db,
  initializeDB,
};
