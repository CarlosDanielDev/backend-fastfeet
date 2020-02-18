module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DeliveryProblems', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      deliveryId: {
        type: Sequelize.INTEGER,
        references: { model: 'Deliveries', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('DeliveryProblems');
  }
};
