module.exports = (sequelize, Sequelize) => {
    const UserRequirement = sequelize.define(
      "user_requirement",
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
        requirement: {
          type: Sequelize.STRING,
        },
      },
      {
        createdAt: false,
        updatedAt: false,
      }
    );
    return UserRequirement;
  };
  