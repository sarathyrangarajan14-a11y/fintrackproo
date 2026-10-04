export interface InstamojoOrderData {
  order_id: string;
  payment_url: string;
  sip_no: string;
  txn_no: string;
  is_mock: boolean;
}

export interface InstamojoPrefillData {
  name?: string;
  email?: string;
  contact?: string;
}

export interface InstamojoOpenOptions {
  order_id: string;
  payment_url: string;
  sip_no: string;
  txn_no: string;
  amountVal: number;
  schemeNameVal: string;
  prefill?: InstamojoPrefillData;
}

class InstamojoService {
  /**
   * Dynamically loads the official Instamojo Checkout JS SDK into the DOM.
   */
  public loadScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Instamojo) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.instamojo.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        // Fallback: If CDN is blocked or unavailable, we still allow direct redirect checkout
        resolve(true);
      };
      document.body.appendChild(script);
    });
  }

  /**
   * Requests backend server to create an Instamojo Payment Request for SIP.
   */
  public async createSipOrder(
    fundId: string,
    amount: number,
    sipDate: number,
    token: string,
    otp?: string,
    verificationToken?: string,
    phone?: string
  ): Promise<InstamojoOrderData> {
    const response = await fetch('/api/sip/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        fundId,
        amount,
        sipDate,
        otp,
        verificationToken,
        phone
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || errData.message || 'Failed to initialize payment request.');
    }

    return response.json();
  }

  /**
   * Cryptographically verifies the payment on the backend in an interactive flow.
   */
  public async verifyPayment(
    payload: {
      payment_id: string;
      payment_request_id: string;
      sipNo: string;
      txnNo: string;
      is_mock: boolean;
    },
    token: string
  ): Promise<{ success: boolean; message?: string }> {
    const response = await fetch('/api/sip/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Payment verification failed.');
    }

    return response.json();
  }

  /**
   * Launches the Instamojo checkout (via popup modal or instant gateway redirect).
   */
  public openCheckout(options: InstamojoOpenOptions): void {
    if (!options.payment_url) {
      throw new Error("Missing payment URL from Instamojo gateway.");
    }

    const Instamojo = typeof window !== 'undefined' ? (window as any).Instamojo : null;

    if (Instamojo && typeof Instamojo.open === 'function') {
      try {
        Instamojo.open(options.payment_url);
        return;
      } catch (err) {
        console.warn("[Instamojo SDK] Modal launch failed, falling back to direct redirect:", err);
      }
    }

    // Direct redirect fallback to secure Instamojo checkout
    window.location.href = options.payment_url;
  }
}

export const instamojoService = new InstamojoService();
export const paymentService = instamojoService;
