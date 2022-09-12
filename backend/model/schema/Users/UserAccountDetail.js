module.exports = (sequelize, Sequelize) => {
    const UserAccountDetail = sequelize.define('user_account_details', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true
        },
        email: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        organization: {
            type: Sequelize.STRING
        },
        lineID: {
            type: Sequelize.STRING
        },
        facebook: {
            type: Sequelize.STRING
        },
        instagram: {
            type: Sequelize.STRING
        },
        website: {
            type: Sequelize.STRING
        }
    })
    return UserAccountDetail;
}