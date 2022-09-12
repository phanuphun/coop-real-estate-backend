module.exports = (sequelize, Sequelize) => {
  const SubDistrict = sequelize.define(
    "SubDistrict",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      zip_code: {
        type: Sequelize.INTEGER,
      },
      name_th: {
        type: Sequelize.STRING,
      },
      name_en: {
        type: Sequelize.STRING,
      },
      latitude: {
        type: Sequelize.DOUBLE
      },
      longitude: {
        type: Sequelize.DOUBLE
      }
    },
    {
      createdAt: false,
      updatedAt: false,
    }
  );
  return SubDistrict;
};
