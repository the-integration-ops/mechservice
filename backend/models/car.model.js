const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Car = sequelize.define("Car", {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Car;
};
