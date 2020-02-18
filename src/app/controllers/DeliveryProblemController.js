import * as Yup from 'yup';
import DeliveryProblems from '../models/DeliveryProblems';
import Deliveries from '../models/Deliveries';

class DeliveryProblemController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveriesProblems = await DeliveryProblems.findAll({
      include: [
        {
          model: Deliveries,
          as: 'delivery',
          attributes: [
            'id',
            'courierId',
            'signatureId',
            'product',
            'canceledAt',
            'startDate',
            'endDate'
          ]
        }
      ],
      limit: 15,
      offset: (page - 1) * 15
    });

    return res.json(deliveriesProblems);
  }

  async show(req, res) {
    const { deliveryId } = req.params;
    const { page = 1 } = req.query;

    const deliveryExists = await Deliveries.findByPk(deliveryId);

    if (!deliveryExists) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    const deliveryProblems = await DeliveryProblems.findAll({
      where: { deliveryId },
      limit: 15,
      offset: (page - 1) * 15,
      include: [
        {
          model: Deliveries,
          as: 'delivery',
          attributes: [
            'id',
            'courierId',
            'signatureId',
            'product',
            'canceledAt',
            'startDate',
            'endDate'
          ]
        }
      ]
    });

    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const { deliveryId } = req.params;
    const schema = Yup.object().shape({
      description: Yup.string()
        .min(3)
        .required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Valdiation fails' });
    }

    const deliveryExists = await Deliveries.findByPk(deliveryId);

    if (!deliveryExists) {
      return res.status(404).json({ error: 'Delivery not found!' });
    }

    const problem = await DeliveryProblems.create({
      description: req.body.description,
      deliveryId
    });

    return res.json(problem);
  }
}

export default new DeliveryProblemController();
