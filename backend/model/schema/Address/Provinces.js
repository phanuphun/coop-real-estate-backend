module.exports = (sequelize, Sequelize) => {
  const Provinces = sequelize.define(
    "Provinces",
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
      lat: {
        type: Sequelize.DOUBLE
      },
      lng: {
        type: Sequelize.DOUBLE
      }
    },
    {
      createdAt: false,
      updatedAt: false,
    }
  );
  return Provinces;
};
