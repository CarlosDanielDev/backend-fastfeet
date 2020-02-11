module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Deliveries', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false
      },
      recipientId: {
        type: Sequelize.INTEGER,
        references: { model: 'Recipients', key: 'id' },
        allowNull: false
      },
      courierId: {
        type: Sequelize.INTEGER,
        references: { model: 'Couriers', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      signatureId: {
        type: Sequelize.INTEGER,
        references: { model: 'Files', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      product: {
        type: Sequelize.STRING,
        allowNull: false
      },
      canceledAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true
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
    return queryInterface.dropTable('Deliveries');
  }
};
