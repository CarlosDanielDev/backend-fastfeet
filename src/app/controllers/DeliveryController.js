import * as Yup from 'yup';
import { Op } from 'sequelize';
import Deliveries from '../models/Deliveries';
import Recipients from '../models/Recipients';
import Couriers from '../models/Couriers';

import Queue from '../../lib/Queue';
import NewDelivery from '../jobs/NewDelivery';

class DeliveryController {
  async index(req, res) {
    const { page = 1, q } = req.query;

    const query = q ? { where: { product: { [Op.like]: `%${q}%` } } } : {};

    const deliveries = await Deliveries.findAll({
      ...query,
      limit: 15,
      offset: (page - 1) * 15
    });

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipientId: Yup.number()
        .integer()
        .required(),
      courierId: Yup.number()
        .integer()
        .required(),
      product: Yup.string()
        .min(3)
        .max(255)
        .required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.statud(401).json({ error: 'Validation Fails!' });
    }

    const { recipientId, courierId } = req.body;

    const recipientExists = await Recipients.findByPk(recipientId);

    if (!recipientExists) {
      return res.status(404).json({ error: 'Recipient not found' });
    }
    const courierExists = await Couriers.findByPk(courierId);

    if (!courierExists) {
      return res.status(404).json({ error: 'Courier not found' });
    }

    const delivery = await Deliveries.create(req.body);

    await Queue.add(NewDelivery.key, {
      courierExists,
      recipientExists,
      delivery
    });

    return res.json(delivery);
  }

  async update(req, res) {
    const { deliveryId } = req.params;

    const schema = Yup.object().shape({
      product: Yup.string()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation Fails' });
    }
    const delivery = await Deliveries.findByPk(deliveryId);

    if (!delivery) {
      return res.status(404).jsn({ error: 'Delivery not found!' });
    }

    await delivery.update(req.body);

    return res.json();
  }

  async delete(req, res) {
    const { deliveryId } = req.params;

    const delivery = await Deliveries.findByPk(deliveryId);

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found!' });
    }

    await delivery.destroy();

    return res.json({ ok: true });
  }
}

export default new DeliveryController();
