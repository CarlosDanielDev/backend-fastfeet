import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import Users from '../app/models/Users';
import Recipients from '../app/models/Recipients';
import Files from '../app/models/Files';
import Couriers from '../app/models/Couriers';
import Deliveries from '../app/models/Deliveries';
import DeliveryProblems from '../app/models/DeliveryProblems';

const models = [
  Users,
  Recipients,
  Couriers,
  Files,
  Deliveries,
  DeliveryProblems
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
    return this;
  }
}

export default new Database();
