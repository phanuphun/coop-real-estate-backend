module.exports = (sequelize, Sequelize) => {
    const UserReportProperty = sequelize.define(
      "user_report_property",
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
    return UserReportProperty;
  };
  