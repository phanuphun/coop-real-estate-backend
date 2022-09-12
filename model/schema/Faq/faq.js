module.exports = (sequelize, Sequelize) => {
    const faq = sequelize.define(
      "faq",
      {
        faqId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        faqQ: {
          type: Sequelize.TEXT,
        },
        faqA: {
          type: Sequelize.TEXT,
        },
        category: {
            type: Sequelize.INTEGER
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
    return faq;
  };
  