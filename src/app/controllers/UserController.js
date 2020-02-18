import { Op } from 'sequelize';
import * as Yup from 'yup';
import Users from '../models/Users';

class UserController {
  async index(req, res) {
    const { page = 1, name } = req.query;
    const query = name ? { where: { name: { [Op.like]: `%${name}%` } } } : '';
    const users = await Users.findAll({
      ...query,
      limit: 15,
      offset: (page - 1) * 15
    });

    return res.json(users);
  }

  async show(req, res) {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(401).json({ error: 'You need to provide the User Id' });
    }
    const user = await Users.findByPk(user_id);

    return res.json(user);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .min(3)
        .required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails!!' });
    }

    const userExists = await Users.findOne({
      where: { email: req.body.email }
    });

    if (userExists) {
      return res.status(400).json({ error: 'User Already exists' });
    }

    const { id, name, email } = await Users.create(req.body);

    return res.json({
      id,
      name,
      email
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().min(3),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      )
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails!!' });
    }

    const { email, oldPassword } = req.body;

    if (!email) {
      return res.status(401).json({ error: 'Emails field its necessary' });
    }

    const user = await Users.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await Users.findOne({
        where: { email }
      });
      if (userExists)
        return res.status(400).json({ error: 'User Already exists' });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = await user.update(req.body);
    return res.json({ id, name, email });
  }

  async delete(req, res) {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(401).json({ error: 'You need to provide the User Id' });
    }
    const user = await Users.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ error: 'User not Found!' });
    }

    await user.destroy();

    return res.json(true);
  }
}

export default new UserController();
