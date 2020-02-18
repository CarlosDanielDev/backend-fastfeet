import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import Mail from '../../lib/Mail';

class CanceledDelivery {
  get key() {
    return 'CanceledDelivery';
  }

  async handle({ data }) {
    const { courier, delivery } = data;

    await Mail.sendMail({
      to: `${courier.name} <${courier.email}>`,
      subject: 'Cancelamento de Encomenda',
      template: 'canceledDelivery',
      context: {
        courier: courier.name,
        product: delivery.product,
        canceledAt: format(new Date(), "'dia' dd 'de' MMMM ', ás 'H:mm'h'", {
          locale: pt
        })
      }
    });
  }
}

export default new CanceledDelivery();
