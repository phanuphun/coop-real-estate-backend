module.exports = (sequelize, Sequelize) => {
    const contactUs = sequelize.define(
      "contact_us",
      {
        contactId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
        },
        email: {
          type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING(10)
        },
        message: {
            type: Sequelize.TEXT
        },
        replyStatus: {
            type: Sequelize.BOOLEAN
        }
      },
      {
        updatedAt: false,
      }
    );
    return contactUs;
  };
  