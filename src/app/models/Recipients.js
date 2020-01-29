import Sequelize, { Model } from 'sequelize';

class Recipients extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        street: Sequelize.STRING,
        complement: Sequelize.STRING,
        number: Sequelize.INTEGER,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        zipCode: Sequelize.STRING
      },
      { sequelize }
    );
    return this;
  }
}

export default Recipients;
