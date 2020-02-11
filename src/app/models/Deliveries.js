import Sequelize, { Model } from 'sequelize';

class Deliveries extends Model {
  static init(sequelize) {
    super.init(
      {
        recipientId: Sequelize.INTEGER,
        courierId: Sequelize.INTEGER,
        signatureId: Sequelize.INTEGER,
        product: Sequelize.STRING
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Recipients, {
      foreignKey: 'recipientId',
      as: 'recipient'
    });
    this.belongsTo(models.Couriers, { foreignKey: 'courierId', as: 'courier' });
    this.belongsTo(models.Files, {
      foreignKey: 'signatureId',
      as: 'signature'
    });
  }
}

export default Deliveries;
