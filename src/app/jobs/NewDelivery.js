import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class NewDelivery {
  get key() {
    return 'NewDelivery';
  }

  async handle({ data }) {
    const { courierExists, recipientExists, delivery } = data;

    await Mail.sendMail({
      to: `${courierExists.name} <${courierExists.email}>`,
      subject: 'Nova Encomenda',
      template: 'newDelivery',
      context: {
        courier: courierExists.name,
        recipient: recipientExists.name,
        date: format(
          parseISO(delivery.createdAt),
          "'dia' dd 'de' MMMM', ás ' H:mm'h'",
          {
            locale: pt
          }
        )
      }
    });
  }
}

export default new NewDelivery();
