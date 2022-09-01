module.exports = (sequelize, Sequelize) => {
    const PropertyFeatures = sequelize.define('property_additional_features', {
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
        },
        selected: {
            type: Sequelize.BOOLEAN
        }
    },
    {
      createdAt: false,
      updatedAt: false,
    })
    return PropertyFeatures;
}