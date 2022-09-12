module.exports = (sequelize, Sequelize) => {
    const UserSubPropAddiFeat = sequelize.define('user_sub_prop_additional_features', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        additionalId: {
            type: Sequelize.INTEGER
        },
        featuresId: {
            type: Sequelize.INTEGER
        }
    },
    {
      createdAt: false,
      updatedAt: false,
    })
    return UserSubPropAddiFeat;
} 