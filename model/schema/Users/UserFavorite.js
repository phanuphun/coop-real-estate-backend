module.exports = (sequelize, Sequelize) => {
    const UserFavorite = sequelize.define(
      "user_favorite",
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
    return UserFavorite;
  };
  