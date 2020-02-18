import * as Yup from 'yup';
import { Op } from 'sequelize';
import Deliveries from '../models/Deliveries';
import Files from '../models/Files';

class FinalizeDeliveryController {
  async update(req, res) {
    const { courierId, deliveryId } = req.params;

    const schema = Yup.object().shape({
      signatureId: Yup.number()
        .integer()
        .required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Valdiation fails!' });
    }

    const { signatureId } = req.body;

    const signatureExists = await Files.findByPk(signatureId);

    if (!signatureExists) {
      return res.status(404).json({ error: 'Signature not found!' });
    }

    const delivery = await Deliveries.findOne({
      where: {
        id: deliveryId,
        courierId,
        startDate: { [Op.ne]: null },
        endDate: null,
        canceledAt: null,
        signatureId: null
      }
    });

    if (!delivery) {
      return res.status(404).json({ error: 'delivery not found' });
    }

    await delivery.update({ endDate: new Date(), signatureId });
    return res.json({ ok: true });
  }
}

export default new FinalizeDeliveryController();
