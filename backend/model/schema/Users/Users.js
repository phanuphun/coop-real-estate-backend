module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define('Users', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        displayName: {
            type: Sequelize.STRING
        },
        fname: {
            type: Sequelize.STRING
        },
        lname: {
            type: Sequelize.STRING
        },
        pictureUrl: {
            type: Sequelize.STRING
        },
        packageId: {
            type: Sequelize.INTEGER
        },
        roleId: {
            type: Sequelize.INTEGER
        },
        subscriptionPeriodId: {
            type: Sequelize.INTEGER
        },
        packageExpire: {
            type: Sequelize.DATE
        }
    })
    return Users;
}