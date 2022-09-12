module.exports = (sequelize, Sequelize) => {
    const MoneyTransfer = sequelize.define(
      "money_transfer",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        userId: {
            type: Sequelize.INTEGER
        },
        packageId: {
          type: Sequelize.INTEGER,
        },
        periodId: {
            type: Sequelize.INTEGER
        },
        price: {
          type: Sequelize.DOUBLE
        },
        pictureUrl: {
            type: Sequelize.STRING
        },
        dateTransfer: {
            type: Sequelize.DATE
        },
        confirm: {
            type: Sequelize.INTEGER(1)
        }
      },
      {
        createdAt: false,
        updatedAt: false,
      }
    );
    return MoneyTransfer;
  };
  