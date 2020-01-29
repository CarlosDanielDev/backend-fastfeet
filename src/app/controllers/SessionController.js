import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import authConfig from '../../config/auth';
import Users from '../models/Users';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails!!' });
    }
    const { email, password } = req.body;

    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found!' });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match!' });
    }

    const { id, name, admin } = user;
    const { secret, expiresIn } = authConfig;
    return res.json({
      user: {
        id,
        name,
        email,
        admin
      },

      token: jwt.sign({ id, name, email, admin }, secret, {
        expiresIn
      })
    });
  }
}

export default new SessionController();
