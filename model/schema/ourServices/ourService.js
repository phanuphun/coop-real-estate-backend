module.exports = (sequelize, Sequelize) => {
    const ourService = sequelize.define(
      "our_service",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        title: {
          type: Sequelize.STRING,
        },
        detail: {
          type: Sequelize.STRING
        },
        icon: {
          type: Sequelize.STRING
        },
      },
      {
        createdAt: false,
        updatedAt: false,
      }
    );
    return ourService;
  };
  