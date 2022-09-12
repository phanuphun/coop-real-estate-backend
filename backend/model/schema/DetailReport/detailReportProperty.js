module.exports = (sequelize, Sequelize) => {
    const detailReportProperty = sequelize.define(
      "detail_report_property",
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
    return detailReportProperty;
  };
  