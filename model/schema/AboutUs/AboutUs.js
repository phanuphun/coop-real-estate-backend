module.exports = (sequelize, Sequelize) => {
    const aboutUs = sequelize.define(
      "about_us",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        ourStory: {
          type: Sequelize.TEXT,
        },
        aboutCompany: {
          type: Sequelize.TEXT
        },
        vision: {
            type: Sequelize.TEXT
        }
      },
      {
        createdAt: false,
        updatedAt: false
      }
    );
    return aboutUs;
  };
  