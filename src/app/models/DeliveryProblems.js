import Sequelize, { Model } from 'sequelize';

class DeliveryProblems extends Model {
  static init(sequelize) {
    super.init(
      {
        deliveryId: Sequelize.INTEGER,
        description: Sequelize.STRING
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Deliveries, {
      foreignKey: 'deliveryId',
      as: 'delivery'
    });
  }
}

export default DeliveryProblems;
