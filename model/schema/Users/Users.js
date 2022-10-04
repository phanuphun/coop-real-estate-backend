module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define('users', {
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
        },
        displayStatus:{
            type: Sequelize.BOOLEAN
        }
    }, {
        timestamp: true

    })
    return Users;
}