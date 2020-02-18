import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Deliveries from '../models/Deliveries';
import hours from '../util/hours';

class WithdrawDeliveryController {
  async update(req, res) {
    const { courierId, deliveryId } = req.params;

    const delivery = await Deliveries.findOne({
      where: { id: deliveryId, courierId, canceledAt: null, startDate: null }
    });

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found!' });
    }

    const currentHour = new Date().getHours();

    if (hours.indexOf(currentHour.toString()) === -1) {
      return res
        .status(401)
        .json({ error: 'You have to withdraw deliveries at business hours' });
    }

    const deliveries = await Deliveries.findAll({
      where: {
        courierId,
        startDate: {
          [Op.between]: [startOfDay(new Date()), endOfDay(new Date())]
        },
        canceledAt: null
      }
    });

    if (deliveries.length >= 5) {
      return res
        .status(401)
        .json({ error: 'You can withdraw only 5 deliveries per day!' });
    }

    await delivery.update({ startDate: new Date() });

    return res.json({ ok: true });
  }
}

export default new WithdrawDeliveryController();
