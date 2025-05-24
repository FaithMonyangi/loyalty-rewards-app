
export class WhatsAppService {
  static formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Add country code if not present (assuming Kenya +254)
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.slice(1);
    } else if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned;
    }
    
    return cleaned;
  }

  static generateMessage(customerName: string, visits: number): string {
    const remaining = Math.max(0, 5 - visits);
    
    if (visits >= 5) {
      return `Hi ${customerName}! 🎉 Thanks for your visit today! You've now completed ${visits} visits and earned a FREE service! 🎁 Show this message to redeem your reward. See you soon! 💅✨`;
    } else if (visits === 4) {
      return `Hi ${customerName}! 😊 Thanks for your visit today! You've visited ${visits} times - just 1 more visit for a FREE service! 🎁 We can't wait to reward your loyalty! 💅✨`;
    } else if (visits === 1) {
      return `Hi ${customerName}! 😊 Thanks for visiting Furaha today! This was your first visit with us. Visit ${remaining} more times and your next service is FREE! ✨ Looking forward to seeing you again! 💅`;
    } else {
      return `Hi ${customerName}! 😊 Thanks for your visit today! You've visited ${visits} times. Just ${remaining} more visits to go for a FREE service! 🎁 Keep up the loyalty! 💅✨`;
    }
  }

  static createWhatsAppLink(phone: string, message: string): string {
    const formattedPhone = this.formatPhoneNumber(phone);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  }

  static sendMessage(phone: string, customerName: string, visits: number): void {
    const message = this.generateMessage(customerName, visits);
    const whatsappLink = this.createWhatsAppLink(phone, message);
    
    // Open WhatsApp in new tab
    window.open(whatsappLink, '_blank');
  }
}
