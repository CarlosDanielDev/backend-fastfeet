import Deliveries from '../models/Deliveries';

class CourierActionsController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const { courierId } = req.params;

    const deliveries = await Deliveries.findAll({
      where: { courierId, canceledAt: null, endDate: null },
      limit: 15,
      offset: (page - 1) * 15
    });

    if (!deliveries) {
      return res.status(404).json({ error: 'Not found!' });
    }

    return res.json();
  }

  async show(req, res) {
    const { page = 1 } = req.query;
    const { courierId } = req.params;

    const deliveries = await Deliveries.findAll({
      where: { courierId, endDate: { $ne: null } },
      limit: 15,
      offset: (page - 1) * 15
    });

    if (!deliveries) {
      return res.status(404).json({ error: 'Not found!' });
    }

    return res.json();
  }
}

export default new CourierActionsController();
