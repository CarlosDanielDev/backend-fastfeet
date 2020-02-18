import Deliveries from '../models/Deliveries';
import Couriers from '../models/Couriers';
import Queue from '../../lib/Queue';
import CanceledDelivery from '../jobs/CanceledDelivery';

class CancelDeliveryController {
  async delete(req, res) {
    const { deliveryId } = req.params;

    const delivery = await Deliveries.findByPk(deliveryId, {
      include: [
        {
          model: Couriers,
          as: 'courier'
        }
      ]
    });
    const { courier } = delivery;

    if (!delivery) {
      return res.status(404).json({ error: 'Deliverty not found' });
    }

    await delivery.update({ canceledAt: new Date() });

    await Queue.add(CanceledDelivery.key, {
      courier,
      delivery
    });
    return res.json({ ok: true });
  }
}

export default new CancelDeliveryController();
