module.exports = (sequelize, Sequelize) => {
    const PropertyPurppse = sequelize.define('property_purpose', {
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
    return PropertyPurppse;
}