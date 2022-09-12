module.exports = (sequelize, Sequelize) => {
    const PropertyAdditional = sequelize.define('property_additional', {
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
    return PropertyAdditional;
}