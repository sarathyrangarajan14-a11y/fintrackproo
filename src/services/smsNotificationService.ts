// Confidential SMS notification service
// Strictly no on-screen OTP broadcasting to maintain end-to-end security and banking compliance.
export interface IncomingSmsMessage {
  id: string;
  sender: string;
  phone: string;
  maskedPhone: string;
  timestamp: string;
  reason?: string;
}

type SmsListener = (sms: IncomingSmsMessage) => void;

class SmsNotificationService {
  private listeners: Set<SmsListener> = new Set();

  public subscribe(listener: SmsListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public notifyIncomingSms(_data: any): void {
    // Strictly No-Op: Confidential OTPs must strictly remain on the user's mobile device via cellular SMS.
    // Never broadcast or display OTPs on the user interface.
  }

  public clear(): void {}
}

export const smsNotificationService = new SmsNotificationService();
