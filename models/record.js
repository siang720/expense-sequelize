"use strict";
module.exports = (sequelize, DataTypes) => {
  const Record = sequelize.define(
    "Record",
    {
      name: DataTypes.STRING,
      category: DataTypes.STRING,
      date: DataTypes.DATE,
      amount: DataTypes.FLOAT
    },
    {}
  );
  Record.associate = function(models) {
    // associations can be defined here
    Record.belongsTo(models.User);
  };
  return Record;
};
