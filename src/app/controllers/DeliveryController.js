import * as Yup from 'yup';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import Deliveries from '../models/Deliveries';
import Recipients from '../models/Recipients';
import Couriers from '../models/Couriers';
import Files from '../models/Files';
import Mail from '../../lib/Mail';

class DeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveries = await Deliveries.findAll({
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
      signatureId: Yup.number()
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
    const { recipientId, courierId, signatureId } = req.body;

    const recipientExists = await Recipients.findByPk(recipientId);

    if (!recipientExists) {
      return res.status(404).json({ error: 'Recipient not found' });
    }
    const courierExists = await Couriers.findByPk(courierId);

    if (!courierExists) {
      return res.status(404).json({ error: 'Courier not found' });
    }
    const { name, email } = courierExists;

    const signatureExists = await Files.findByPk(signatureId);

    if (!signatureExists) {
      return res.status(404).json({ error: 'Signature not found!' });
    }

    const delivery = await Deliveries.create(req.body);

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Nova Encomenda',
      template: 'newDelivery',
      context: {
        courier: name,
        recipient: recipientExists.name,
        date: format(delivery.createdAt, "'dia' dd 'de' MMMM', ás ' H:mm'h'", {
          locale: pt
        })
      }
    });

    return res.json(delivery);
  }
}

export default new DeliveryController();
