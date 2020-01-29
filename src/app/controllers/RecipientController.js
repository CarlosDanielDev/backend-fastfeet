import * as Yup from 'yup';
import Recipients from '../models/Recipients';

class RecipientController {
  async index(req, res) {
    const { page = 1, name } = req.query;

    const recipients = await Recipients.findAll(
      name
        ? { where: { name }, limit: 15, offset: (page - 1) * 15 }
        : {
            limit: 15,
            offset: (page - 1) * 15
          }
    );

    return res.json(recipients);
  }

  async show(req, res) {
    const { recipient_id } = req.params;

    if (!recipient_id) {
      return res.status(401).json({ error: 'This Recipient ID is invalid!' });
    }
    const recipient = await Recipients.findByPk(recipient_id);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found!' });
    }
    return res.json(recipient);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .min(3)
        .required(),
      street: Yup.string()
        .min(3)
        .required(),
      complement: Yup.string()
        .min(3)
        .required(),
      number: Yup.number()
        .integer()
        .min(1)
        .required(),
      state: Yup.string()
        .min(2)
        .required(),
      city: Yup.string()
        .min(3)
        .required(),
      zipCode: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation Fails!' });
    }
    const { name } = req.body;

    const recipientExists = await Recipients.findOne({
      where: { name }
    });

    if (recipientExists) {
      return res.status(401).json({ error: 'This Recipient Already Exists!' });
    }

    const recipient = await Recipients.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    const { recipient_id } = req.params;

    if (!recipient_id) {
      return res.status(401).json({ error: 'Recipient ID not provided!' });
    }
    const schema = Yup.object().shape({
      name: Yup.string().min(3),
      street: Yup.string().min(3),
      complement: Yup.string().min(3),
      number: Yup.number()
        .integer()
        .min(1),
      state: Yup.string().min(2),
      city: Yup.string().min(3),
      zipCode: Yup.string().min(3)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation Fails!' });
    }

    const recipient = await Recipients.findByPk(recipient_id);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found!' });
    }
    if (req.body.name) {
      const recipientAnother = await Recipients.findOne({
        where: { id: { $not: recipient_id }, name: req.body.name }
      });

      if (recipientAnother) {
        return res
          .status(401)
          .json({ error: 'This name is already used, try another name!' });
      }
    }

    const { name, street, number, city, state } = await recipient.update(
      req.body
    );

    return res.json({ name, street, number, city, state });
  }

  async delete(req, res) {
    const { recipient_id } = req.params;

    if (!recipient_id) {
      return res
        .status(401)
        .json({ error: 'You need to Provide the Recipient ID!' });
    }
    const recipient = await Recipients.findByPk(recipient_id);

    if (recipient) {
      return res.status(404).json({ error: 'Recipient not Found!' });
    }
    await recipient.destroy();

    return res.json(true);
  }
}

export default new RecipientController();
