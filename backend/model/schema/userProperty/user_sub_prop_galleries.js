module.exports = (sequelize, Sequelize) => {
    const UserSubPropGallery = sequelize.define('user_sub_prop_galleries', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        path: {
            type: Sequelize.STRING
        },
        propertyId: {
            type: Sequelize.INTEGER
        },
        
    },
    {
      createdAt: false,
      updatedAt: false,
    })
    return UserSubPropGallery;
}