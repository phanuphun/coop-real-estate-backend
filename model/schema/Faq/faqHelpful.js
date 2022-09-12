module.exports = (sequelize, Sequelize) => {
    const faqHelpful = sequelize.define(
      "faqhelpful",
      {
        faqHelpfulId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        userId: {
          type: Sequelize.INTEGER,
        },
        faqId: {
          type: Sequelize.INTEGER,
        },
        helpful: {
            type: Sequelize.BOOLEAN
        }
      },
      {
        createdAt: false,
        updatedAt: false,
      }
    );
    return faqHelpful;
  };
  