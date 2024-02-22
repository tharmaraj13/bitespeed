module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("contact", {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      linkedId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      linkPrecedence: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable("contact");
  },
};
