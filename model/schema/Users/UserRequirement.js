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
        purposeId: {
          type: Sequelize.INTEGER,
        },
        typeId: {
          type: Sequelize.INTEGER
        },
        subDistrictId: {
          type: Sequelize.INTEGER
        }
      },
       
    );
    return UserRequirement;
  };
  