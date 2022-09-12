module.exports = (sequelize, Sequelize) => {
  const Roles = sequelize.define(
    "roles",
    {
      roleId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      role_name: {
        type: Sequelize.STRING,
      },
    },
    {
      createdAt: false,
      updatedAt: false,
    }
  );
  return Roles;
};
