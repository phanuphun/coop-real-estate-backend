module.exports = (sequelize, Sequelize) => {
    const promotions = sequelize.define(
      "promotions",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        code: {
            type: Sequelize.STRING(10)
        },
        title: {
          type: Sequelize.STRING,
        },
        detail: {
          type: Sequelize.TEXT
        },
        dateStart: {
          type: Sequelize.DATE
        },
        dateEnd: {
          type: Sequelize.DATE
        },
        displayStatus: {
          type: Sequelize.BOOLEAN
        }
  
      },
      {
        createdAt: false,
        updatedAt: false,
      }
    );
    return promotions;
  };
  