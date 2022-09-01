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
        name: {
          type: Sequelize.STRING,
        },  
      },
      {
        createdAt: false,
        updatedAt: false,
      }
    );
    return SubscriptionPeriod;
  };
  