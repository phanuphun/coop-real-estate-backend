module.exports = (sequelize, Sequelize) => {
    const detailReportUser = sequelize.define(
      "detail_report_user",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
        },
        description: {
          type: Sequelize.STRING
        },
      },
      {
        createdAt: false,
        updatedAt: false,
      }
    );
    return detailReportUser;
  };
  