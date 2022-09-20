module.exports = (sequelize, Sequelize) => {
    const feedback = sequelize.define(
      "feedbacks",
      {
        feedbackId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        email: {
          type: Sequelize.STRING
        },
        message: {
            type: Sequelize.TEXT
        }
      },
      {
        updatedAt: false,
      }
    );
    return feedback;
  };
  