module.exports = (sequelize, Sequelize) => {
  const District = sequelize.define(
    "district",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      code: {
        type: Sequelize.INTEGER,
      },
      name_th: {
        type: Sequelize.STRING,
      },
      name_en: {
        type: Sequelize.STRING,
      },
    },
    {
      createdAt: false,
      updatedAt: false,
    }
  );
  return District;
};
