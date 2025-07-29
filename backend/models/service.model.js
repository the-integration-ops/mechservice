const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Service = sequelize.define("Service", {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  return Service;
};
