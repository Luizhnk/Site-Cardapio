import { Order } from '../types/restaurant';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function cleanPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10 || cleaned.length === 11) {
    if (!cleaned.startsWith('55')) {
      cleaned = '55' + cleaned;
    }
  }
  return cleaned;
}

export function getPaymentMethodLabel(method: string): string {
  switch (method) {
    case 'credit_card': return '💳 Cartão de Crédito';
    case 'debit_card': return '💳 Cartão de Débito';
    case 'pix': return '⚡ Pix';
    case 'cash': return '💵 Dinheiro';
    default: return method;
  }
}

/**
 * Creates the formatted WhatsApp message sent to the restaurant when an order is placed
 */
export function generateRestaurantWhatsAppLink(order: Order, restaurantPhone: string, restaurantName: string): string {
  const phone = cleanPhone(restaurantPhone);
  
  const itemsText = order.items
    .map(i => `• *${i.quantity}x* ${i.name} - ${formatCurrency(i.price * i.quantity)}${i.notes ? `\n   _Obs: ${i.notes}_` : ''}`)
    .join('\n');

  const addressText = `${order.address.street}, Nº ${order.address.number}
Bairro: ${order.address.neighborhood}${order.address.complement ? `\nComplemento: ${order.address.complement}` : ''}`;

  let paymentText = getPaymentMethodLabel(order.paymentMethod);
  if (order.paymentMethod === 'cash' && order.cashChangeFor) {
    paymentText += ` (Troco para ${formatCurrency(order.cashChangeFor)})`;
  }

  const message = `👋 Olá, *${restaurantName}*!
Acabei de fazer o pedido *#${order.id}* pelo cardápio digital.

📋 *DETALHES DO PEDIDO:*
${itemsText}

━━━━━━━━━━━━━━━━━━━
🛵 *Subtotal:* ${formatCurrency(order.subtotal)}
📍 *Taxa de Entrega:* ${formatCurrency(order.deliveryFee)}
💰 *VALOR TOTAL:* *${formatCurrency(order.total)}*
━━━━━━━━━━━━━━━━━━━

👤 *DADOS DO CLIENTE:*
*Nome:* ${order.customerName}
*WhatsApp:* ${order.customerPhone}

📍 *ENDEREÇO DE ENTREGA:*
${addressText}

💳 *FORMA DE PAGAMENTO:*
${paymentText}

Por favor, confirmem o recebimento e o início do preparo! Obrigado(a)!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Creates WhatsApp contact link for the admin to speak directly with the customer
 */
export function generateCustomerWhatsAppLink(order: Order, restaurantName: string, customMessage?: string): string {
  const phone = cleanPhone(order.customerPhone);
  
  const defaultMessage = `Olá *${order.customerName}*, aqui é do *${restaurantName}*!
Estamos entrando em contato sobre o seu pedido *#${order.id}*.
Como podemos te ajudar?`;

  const msg = customMessage || defaultMessage;
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}
