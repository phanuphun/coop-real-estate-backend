module.exports = (sequelize, Sequelize) => {
    const UserSubProp = sequelize.define("user_sub_prop", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        propFor: {
            type: Sequelize.INTEGER
        },
        priceSale: {
            type: Sequelize.DOUBLE
        },
        priceRent: {
            type: Sequelize.DOUBLE
        },
        propType: {
            type: Sequelize.INTEGER
        },
        lat: {
            type: Sequelize.DOUBLE
        },
        lng: {
            type: Sequelize.DOUBLE
        },
        houseNo: {
            type: Sequelize.STRING
        },
        addressId:{
            type: Sequelize.INTEGER
        },
    },
    {
        timestamp: true 
    })

    return UserSubProp;
}