module.exports = (sequelize, Sequelize) => {
    const UserSubPropAddi = sequelize.define('user_sub_prop_additional', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        bedrooms: {
            type: Sequelize.INTEGER
        },
        bathrooms: {
            type: Sequelize.INTEGER
        },
        garages: {
            type: Sequelize.INTEGER
        },
        area: {
            type: Sequelize.INTEGER
        },
        floor: {
            type: Sequelize.INTEGER
        },
        yearBuilt: {
            type: Sequelize.INTEGER
        },
        propertyId: {
            type: Sequelize.INTEGER
        }
    },
    {
      createdAt: false,
      updatedAt: false,
    })
    return UserSubPropAddi;
}