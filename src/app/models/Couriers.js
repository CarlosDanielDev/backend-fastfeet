import Sequelize, { Model } from 'sequelize';

class Couriers extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Files, { foreignKey: 'avatarId', as: 'avatar' });
  }
}

export default Couriers;
