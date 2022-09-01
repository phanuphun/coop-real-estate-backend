module.exports = (sequelize, Sequelize) => {
  const Geography = sequelize.define(
    "Geography",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
    },
    {
      createdAt: false,
      updatedAt: false,
    }
  );
  return Geography;
};
