module.exports = (sequelize, Sequelize) => {
    const UserReportUser = sequelize.define(
      "user_report_user",
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
        userReportedId: {
          type: Sequelize.INTEGER
        },
        detailReportId: {
          type: Sequelize.INTEGER
        },
        description: {
            type: Sequelize.STRING
        }
      },
      {
        createdAt: false,
        updatedAt: false,
      }
    );
    return UserReportUser;
  };
  