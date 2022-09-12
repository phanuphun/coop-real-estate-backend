module.exports = (sequelize, Sequelize) => {
    const SubscriptionPeriod = sequelize.define(
      "subscription_period",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        period: {
          type: Sequelize.INTEGER(3),
        },  
      },
      {
        createdAt: false,
        updatedAt: false,
      }
    );
    return SubscriptionPeriod;
  };
  