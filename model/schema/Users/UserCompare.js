module.exports = (sequelize, Sequelize) => {
    const UserCompare = sequelize.define(
      "user_compare",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        userId: {
          type: Sequelize.INTEGER,
        },
        propertyId: {
          type: Sequelize.INTEGER,
        },
      },
      {
        createdAt: false,
        updatedAt: false,
      }
    );
    return UserCompare;
  };
  