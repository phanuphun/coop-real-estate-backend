module.exports = (sequelize, Sequelize) => {
    const faqCategory = sequelize.define(
      "faq_category",
      {
        faqCategoryId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        faqCategoryName: {
          type: Sequelize.STRING,
        },
      },
      {
        createdAt: false,
        updatedAt: false,
      }
    );
    return faqCategory;
  };
  