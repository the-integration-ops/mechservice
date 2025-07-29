const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Shop = sequelize.define("Shop", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Shop;
};
