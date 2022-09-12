module.exports = (sequelize, Sequelize) => {
  const package = sequelize.define(
    "package",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING
      },
      price1M: {
        type: Sequelize.DOUBLE
      },
      price3M: {
        type: Sequelize.DOUBLE
      },
      price6M: {
        type: Sequelize.DOUBLE
      },
      propertyLimit: {
        type: Sequelize.INTEGER(3)
      }

    },
    {
      createdAt: false,
      updatedAt: false,
    }
  );
  return package;
};
