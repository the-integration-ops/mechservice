const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
    is_mechanic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return User;
};
