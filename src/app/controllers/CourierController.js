import * as Yup from 'yup';
import Couriers from '../models/Couriers';
import Files from '../models/Files';

class CourierController {
  async index(req, res) {
    const { page = 1, name } = req.query;
    const couriers = await Couriers.findAll(
      name
        ? { where: { name }, limit: 15, offset: (page - 1) * 15 }
        : { limit: 15, offset: (page - 1) * 15 }
    );

    return res.json(couriers);
  }

  async show(req, res) {
    const { courier_id } = req.params;

    const courier = await Couriers.findByPk(courier_id, {
      include: [
        { model: Files, as: 'avatar', attributes: ['id', 'path', 'url'] }
      ]
    });

    if (!courier) {
      return res.status(404).json({ error: 'Courier Not found!' });
    }

    return res.json(courier);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .min(3)
        .required(),
      email: Yup.string()
        .email()
        .required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Valdiation Fails!' });
    }

    const { email } = req.body;

    const courierEmailExist = await Couriers.findOne({ where: { email } });

    if (courierEmailExist) {
      return res.status(401).json({
        error: 'This email, is already used, try to put a different email!'
      });
    }
    const courier = await Couriers.create(req.body);

    return res.json(courier);
  }

  async update(req, res) {
    const { courier_id } = req.params;
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatarId: Yup.number().integer()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Valdiation Fails!' });
    }

    const { email, avatarId } = req.body;

    if (email) {
      const courierEmailExists = await Couriers.findOne({
        where: { email, id: { $not: courier_id } }
      });
      if (courierEmailExists) {
        return res.status(401).json({ error: 'This email is already in use!' });
      }
    }
    const courier = await Couriers.findByPk(courier_id);

    if (!courier) {
      return res.status(404).json({ error: 'Courier Not Found!' });
    }
    if (avatarId) {
      const avatarExists = await Files.findByPk(avatarId);

      if (!avatarExists) {
        return res.status(404).json({ eror: 'Avatar ID not Found!' });
      }

      const avatarIsAssociate = await Couriers.findOne({
        where: { id: { $not: courier_id }, avatarId }
      });
      if (avatarIsAssociate) {
        return res
          .status(401)
          .json({ error: 'This Avatar ID is already be associated' });
      }
    }

    const { id, name } = await courier.update(req.body);

    return res.json({ id, name, email });
  }

  async delete(req, res) {
    const { courier_id } = req.params;

    const courier = await Couriers.findByPk(courier_id);

    if (!courier) {
      return res
        .status(404)
        .json({ error: 'Courier not found, try a different ID' });
    }
    await courier.destroy();
    return res.json({ ok: true });
  }
}

export default new CourierController();
