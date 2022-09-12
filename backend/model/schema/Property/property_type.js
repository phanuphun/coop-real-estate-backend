module.exports = (sequelize, Sequelize) => {
    const PropertyType = sequelize.define('property_type', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name_th: {
            type: Sequelize.STRING
        },
        name_en: {
            type: Sequelize.STRING
        }
    },
    {
      createdAt: false,
      updatedAt: false,
    })
    return PropertyType;
}