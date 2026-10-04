import nodemailer from 'nodemailer';

export interface QuotationEmailPayload {
  to: string;
  clientName?: string;
  schemeCode: string | number;
  schemeName: string;
  nav: string | number;
  date?: string;
  investmentAmount?: number | string;
  notes?: string;
  proposalId?: string;
  appUrl?: string;
  partnerName?: string;
  partnerEmail?: string;
  partnerPhone?: string;
}

export interface SipApprovalEmailPayload {
  to: string;
  clientName?: string;
  clientId?: string | number;
  sipId: string | number;
  schemeCode: string | number;
  schemeName: string;
  amount: number | string;
  frequency?: string;
  sipDate: number | string;
  startDate?: string;
  nextInstallmentDate?: string;
  allottedUnits?: string | number;
  nav?: string | number;
  referenceNumber?: string;
  partnerName?: string;
  arnNumber?: string;
  appUrl?: string;
}

export interface EmailDispatchResult {
  success: boolean;
  channel: 'RESEND' | 'SMTP' | 'SIMULATED';
  message: string;
  providerDetails?: string;
  proposalId?: string;
  mailtoUrl?: string;
  subject?: string;
  plainText?: string;
  html?: string;
  error?: string;
}

export interface EmailLogEntry {
  id: string;
  recipientEmail: string;
  recipientName: string;
  senderEmail: string;
  senderName: string;
  subject: string;
  category: 'FUND_QUOTATION' | 'PORTFOLIO_REPORT' | 'KYC_ALERT' | 'SIP_ALERT' | 'TRANSACTION' | 'DIRECT_MESSAGE';
  status: 'DELIVERED' | 'BOUNCED' | 'PENDING' | 'SIMULATED';
  channel: 'RESEND' | 'SMTP' | 'SIMULATED';
  messageId?: string;
  proposalId?: string;
  schemeCode?: string;
  schemeName?: string;
  reportId?: string;
  reportType?: string;
  investmentAmount?: number | string;
  notes?: string;
  htmlContent: string;
  plainText: string;
  mailtoUrl: string;
  errorReason?: string;
  diagnosticCode?: string;
  deliveryAttempts: number;
  lastAttemptAt: string;
  createdAt: string;
  deliveredAt?: string;
  bouncedAt?: string;
  openedAt?: string;
  clickedAt?: string;
  metadata?: Record<string, any>;
}

// In-Memory Durable Email Log Store
export const emailLogsStore = new Map<string, EmailLogEntry>();

export function clearEmailLogs(): void {
  emailLogsStore.clear();
}

export function recordEmailLog(entry: Omit<EmailLogEntry, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): EmailLogEntry {
  const logId = entry.id || `EML-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();
  
  const fullEntry: EmailLogEntry = {
    ...entry,
    id: logId,
    createdAt: entry.createdAt || now,
    lastAttemptAt: entry.lastAttemptAt || now,
    deliveryAttempts: entry.deliveryAttempts || 1
  };

  emailLogsStore.set(logId, fullEntry);
  return fullEntry;
}

/**
 * Constructs a responsive, professional HTML email template for Fund Quotation
 */
export function buildFundQuotationHtml(payload: QuotationEmailPayload): string {
  const {
    to,
    clientName = 'Valued Investor',
    schemeCode,
    schemeName,
    nav,
    date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    investmentAmount,
    notes,
    proposalId,
    appUrl = process.env.APP_URL || 'https://fintrackpro.in',
    partnerName = 'PARTHASARATHY Radhakrishnan (Velocity Wealth Partner)'
  } = payload;

  const investLink = `${appUrl.replace(/\/$/, '')}/explore?scheme=${schemeCode}&ref=${proposalId}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Investment Proposal: ${schemeName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b1120; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b1120; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #0f172a; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.12); overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 32px 32px 24px; background: linear-gradient(135deg, #064e3b 0%, #022c22 100%); border-bottom: 1px solid rgba(16, 185, 129, 0.2);">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #34d399; background: rgba(52, 211, 153, 0.15); padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(52, 211, 153, 0.3);">
                      Investment Proposal
                    </span>
                    <h1 style="margin: 12px 0 4px; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                      FinTrackPro
                    </h1>
                    <p style="margin: 0; font-size: 13px; color: #a7f3d0;">
                      VELOCITY WEALTH • Private Wealth & Investment Advisory
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
                Dear <strong style="color: #ffffff;">${clientName}</strong>,
              </p>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                Your wealth advisor <strong style="color: #f8fafc;">${partnerName}</strong> has prepared an investment proposal tailored for your portfolio objectives.
              </p>

              <!-- Fund Highlight Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 24px; overflow: hidden;">
                <tr>
                  <td style="padding: 24px;">
                    <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">
                      Recommended Scheme
                    </span>
                    <h2 style="margin: 6px 0 12px; font-size: 18px; font-weight: 700; color: #ffffff; line-height: 1.4;">
                      ${schemeName}
                    </h2>
                    
                    <table width="100%" cellspacing="0" cellpadding="0" style="margin-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 16px;">
                      <tr>
                        <td width="50%" style="vertical-align: top;">
                          <p style="margin: 0 0 4px; font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700;">Live AMFI NAV</p>
                          <p style="margin: 0; font-size: 20px; font-weight: 800; color: #34d399;">
                            ₹${nav}
                          </p>
                          <p style="margin: 2px 0 0; font-size: 11px; color: #64748b;">As of ${date}</p>
                        </td>
                        <td width="50%" style="vertical-align: top; text-align: right;">
                          <p style="margin: 0 0 4px; font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700;">Scheme Code</p>
                          <p style="margin: 0; font-size: 16px; font-weight: 700; font-family: monospace; color: #f1f5f9;">
                            ${schemeCode}
                          </p>
                          <p style="margin: 2px 0 0; font-size: 11px; color: #34d399;">Direct / Growth</p>
                        </td>
                      </tr>
                    </table>

                    ${investmentAmount ? `
                    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
                      <table width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td><span style="font-size: 12px; color: #94a3b8;">Proposed Allocation:</span></td>
                          <td align="right"><span style="font-size: 14px; font-weight: 800; color: #ffffff;">₹${Number(investmentAmount).toLocaleString('en-IN')}</span></td>
                        </tr>
                      </table>
                    </div>
                    ` : ''}

                    ${notes ? `
                    <div style="margin-top: 16px; background-color: rgba(0, 0, 0, 0.25); border-radius: 10px; padding: 12px; border-left: 3px solid #10b981;">
                      <p style="margin: 0; font-size: 12px; color: #cbd5e1; font-style: italic;">
                        "${notes}"
                      </p>
                    </div>
                    ` : ''}
                  </td>
                </tr>
              </table>

              <!-- Call To Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${investLink}" target="_blank" style="display: inline-block; background-color: #10b981; color: #022c22; font-weight: 800; font-size: 15px; text-decoration: none; padding: 16px 36px; border-radius: 12px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">
                      Review Scheme & Invest Online
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 8px; font-size: 12px; color: #64748b; text-align: center;">
                Proposal Reference: <code style="color: #94a3b8; background: #1e293b; padding: 2px 6px; border-radius: 4px;">${proposalId}</code>
              </p>
              <p style="margin: 0; font-size: 12px; color: #64748b; text-align: center;">
                Or copy and paste this link in your browser: <br/>
                <a href="${investLink}" style="color: #34d399; word-break: break-all;">${investLink}</a>
              </p>
            </td>
          </tr>

          <!-- Compliance & Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #0b1120; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
              <p style="margin: 0 0 8px; font-size: 11px; color: #64748b; line-height: 1.5;">
                <strong>SEBI Disclaimer:</strong> Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. Past performance is not an indicator of future returns.
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569;">
                VELOCITY WEALTH | FinTrackPro Advisory Platform | AMFI Registered Mutual Fund Distributor
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generates Plain Text representation for email clients and mailto fallback
 */
export function buildFundQuotationPlainText(payload: QuotationEmailPayload): string {
  const {
    clientName = 'Valued Investor',
    schemeCode,
    schemeName,
    nav,
    date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    investmentAmount,
    notes,
    proposalId,
    appUrl = process.env.APP_URL || 'https://fintrackpro.in',
    partnerName = 'PARTHASARATHY Radhakrishnan (Velocity Wealth Partner)'
  } = payload;

  const investLink = `${appUrl.replace(/\/$/, '')}/explore?scheme=${schemeCode}&ref=${proposalId}`;

  return `
FINTRACKPRO INVESTMENT PROPOSAL (VELOCITY WEALTH)
=================================================
Proposal Reference: ${proposalId}
Date: ${date}

Dear ${clientName},

Your wealth advisor ${partnerName} has prepared the following mutual fund investment proposal for your review:

RECOMMENDED FUND:
-----------------
Scheme Name: ${schemeName}
Scheme Code: ${schemeCode}
Current AMFI NAV: INR ${nav} (As of ${date})
${investmentAmount ? `Proposed Investment: INR ${Number(investmentAmount).toLocaleString('en-IN')}\n` : ''}${notes ? `Advisor Note: ${notes}\n` : ''}

DIRECT INVESTMENT & SCHEME DETAILS LINK:
${investLink}

SEBI Disclaimer: Mutual fund investments are subject to market risks, read all scheme related documents carefully.

VELOCITY WEALTH • FinTrackPro Platform
  `.trim();
}

/**
 * Constructs a responsive, professional HTML email template for SIP Mandate Approval
 */
export function buildSipApprovalHtml(payload: SipApprovalEmailPayload): string {
  const {
    to,
    clientName = 'Valued Investor',
    clientId,
    sipId,
    schemeCode,
    schemeName,
    amount,
    frequency = 'Monthly',
    sipDate,
    startDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    nextInstallmentDate,
    allottedUnits,
    nav,
    referenceNumber = `SIP-REG-${Math.floor(100000 + Math.random() * 900000)}`,
    partnerName = 'PARTHASARATHY Radhakrishnan',
    arnNumber = 'ARN-348996',
    appUrl = process.env.APP_URL || 'https://fintrackpro.in'
  } = payload;

  const dashboardLink = `${appUrl.replace(/\/$/, '')}/dashboard`;
  const formattedAmount = Number(amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SIP Mandate Approved: ${schemeName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b1120; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b1120; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #0f172a; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.12); overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 32px 32px 24px; background: linear-gradient(135deg, #064e3b 0%, #022c22 100%); border-bottom: 1px solid rgba(16, 185, 129, 0.2);">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #34d399; background: rgba(52, 211, 153, 0.15); padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(52, 211, 153, 0.3);">
                      ✓ SIP Approved & Registered
                    </span>
                    <h1 style="margin: 12px 0 4px; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                      FinTrackPro Mandate Desk
                    </h1>
                    <p style="margin: 0; font-size: 13px; color: #a7f3d0;">
                      VELOCITY WEALTH • Systematic Investment Plan Confirmation
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
                Dear <strong style="color: #ffffff;">${clientName}</strong>,
              </p>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                We are pleased to inform you that your Systematic Investment Plan (SIP) mandate has been <strong style="color: #34d399;">approved and activated</strong> by your advisor <strong style="color: #ffffff;">${partnerName}</strong> (${arnNumber}).
              </p>

              <!-- SIP Highlight Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 24px; overflow: hidden;">
                <tr>
                  <td style="padding: 24px;">
                    <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">
                      Active SIP Scheme
                    </span>
                    <h2 style="margin: 6px 0 16px; font-size: 18px; font-weight: 700; color: #ffffff; line-height: 1.4;">
                      ${schemeName}
                    </h2>
                    
                    <table width="100%" cellspacing="0" cellpadding="0" style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 16px;">
                      <tr>
                        <td width="50%" style="vertical-align: top; padding-bottom: 12px;">
                          <p style="margin: 0 0 2px; font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700;">Monthly SIP Amount</p>
                          <p style="margin: 0; font-size: 20px; font-weight: 800; color: #34d399;">${formattedAmount}</p>
                        </td>
                        <td width="50%" style="vertical-align: top; padding-bottom: 12px; text-align: right;">
                          <p style="margin: 0 0 2px; font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700;">SIP Debit Day</p>
                          <p style="margin: 0; font-size: 16px; font-weight: 700; color: #f1f5f9;">Day ${sipDate} (${frequency})</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" style="vertical-align: top;">
                          <p style="margin: 0 0 2px; font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700;">Mandate Reference</p>
                          <p style="margin: 0; font-size: 13px; font-weight: 700; font-family: monospace; color: #cbd5e1;">${referenceNumber}</p>
                        </td>
                        <td width="50%" style="vertical-align: top; text-align: right;">
                          <p style="margin: 0 0 2px; font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700;">Scheme Code</p>
                          <p style="margin: 0; font-size: 13px; font-weight: 700; font-family: monospace; color: #cbd5e1;">${schemeCode}</p>
                        </td>
                      </tr>
                      ${allottedUnits && nav ? `
                      <tr>
                        <td colspan="2" style="padding-top: 14px; margin-top: 10px; border-top: 1px dashed rgba(255, 255, 255, 0.08);">
                          <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                            Initial Allotment: <strong style="color: #ffffff;">${allottedUnits} units</strong> @ AMFI NAV <strong style="color: #34d399;">₹${nav}</strong>
                          </p>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Call to Action -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${dashboardLink}" target="_blank" style="display: inline-block; background-color: #10b981; color: #022c22; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">
                      View Portfolio Dashboard &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Advisor Signature -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: rgba(255, 255, 255, 0.03); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.06); padding: 16px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px; font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b;">Authorized Mutual Fund Distributor</p>
                    <p style="margin: 0; font-size: 14px; font-weight: 700; color: #ffffff;">${partnerName}</p>
                    <p style="margin: 2px 0 0; font-size: 12px; color: #94a3b8;">ARN: ${arnNumber} | VELOCITY WEALTH Advisory Network</p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                Auto-debit instructions have been submitted for processing. Subsequent installments will be automatically triggered on day ${sipDate} of every calendar month.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #080d1a; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <p style="margin: 0 0 8px; font-size: 11px; color: #64748b; line-height: 1.5;">
                <strong>SEBI Disclaimer:</strong> Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing.
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569;">
                VELOCITY WEALTH | FinTrackPro Advisory Platform | AMFI Registered Mutual Fund Distributor
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function buildSipApprovalPlainText(payload: SipApprovalEmailPayload): string {
  const {
    clientName = 'Valued Investor',
    schemeCode,
    schemeName,
    amount,
    frequency = 'Monthly',
    sipDate,
    referenceNumber,
    partnerName = 'PARTHASARATHY Radhakrishnan',
    arnNumber = 'ARN-348996',
    allottedUnits,
    nav,
    appUrl = process.env.APP_URL || 'https://fintrackpro.in'
  } = payload;

  return `
FINTRACKPRO SIP MANDATE REGISTRATION & APPROVAL (VELOCITY WEALTH)
================================================================
Mandate Reference: ${referenceNumber || 'N/A'}
Date: ${new Date().toLocaleDateString('en-IN')}

Dear ${clientName},

Your Systematic Investment Plan (SIP) mandate has been APPROVED and ACTIVATED by your advisor ${partnerName} (${arnNumber}).

SIP DETAILS:
------------
Scheme Name: ${schemeName}
Scheme Code: ${schemeCode}
Monthly SIP Amount: INR ${Number(amount).toLocaleString('en-IN')}
SIP Debit Day: Day ${sipDate} (${frequency})
${allottedUnits && nav ? `Initial Allotment: ${allottedUnits} units @ AMFI NAV INR ${nav}\n` : ''}

VIEW PORTFOLIO:
${appUrl.replace(/\/$/, '')}/dashboard

SEBI Disclaimer: Mutual fund investments are subject to market risks, read all scheme related documents carefully.

VELOCITY WEALTH • FinTrackPro Platform | AMFI Registered Distributor
  `.trim();
}

/**
 * Helper to build an optimized Nodemailer transporter for standard SMTP or Resend SMTP (smtp.resend.com)
 */
function createSmtpTransporter() {
  const host = process.env.SMTP_HOST || (process.env.RESEND_API_KEY ? 'smtp.resend.com' : undefined);
  const user = process.env.SMTP_USER || (host === 'smtp.resend.com' ? 'resend' : process.env.GMAIL_USER);
  const pass = process.env.SMTP_PASS || process.env.RESEND_API_KEY || process.env.GMAIL_APP_PASSWORD;
  const port = Number(process.env.SMTP_PORT) || (host === 'smtp.resend.com' ? 465 : 587);
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : (port === 465);

  if (!host || !user || !pass) {
    return null;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    }
  });

  const defaultFrom = host === 'smtp.resend.com' 
    ? (process.env.RESEND_FROM || process.env.SMTP_FROM || 'FinTrackPro Advisory <onboarding@resend.dev>')
    : (process.env.SMTP_FROM || `"FinTrackPro by Velocity Wealth" <${user}>`);

  return { transporter, host, port, secure, user, defaultFrom };
}

/**
 * Returns current server-side configuration status for UI telemetry
 */
export function getEmailTransportConfigStatus() {
  const hasResendApiKey = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.length > 5);
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPort = process.env.SMTP_PORT || (smtpHost === 'smtp.resend.com' ? '465' : '587');
  const hasSmtpConfig = Boolean(smtpHost && smtpUser && (process.env.SMTP_PASS || process.env.RESEND_API_KEY));

  return {
    resendRestConfigured: hasResendApiKey,
    smtpConfigured: hasSmtpConfig,
    activeProvider: hasResendApiKey ? 'RESEND_REST' : hasSmtpConfig ? (smtpHost === 'smtp.resend.com' ? 'RESEND_SMTP' : 'CUSTOM_SMTP') : 'SIMULATED',
    smtpHost: smtpHost || (hasResendApiKey ? 'smtp.resend.com' : 'Not configured'),
    smtpPort: smtpPort,
    smtpUser: smtpUser || (smtpHost === 'smtp.resend.com' ? 'resend' : 'N/A'),
    senderFrom: process.env.RESEND_FROM || process.env.SMTP_FROM || 'FinTrackPro Advisory <onboarding@resend.dev>'
  };
}

/**
 * Dispatches the quotation email via available channels (Resend -> SMTP -> Simulated/Mailto)
 * and automatically logs it in the email status audit store.
 */
export async function sendFundQuotationEmail(payload: QuotationEmailPayload): Promise<EmailDispatchResult> {
  const subject = `Investment Proposal: ${payload.schemeName} (NAV ₹${payload.nav})`;
  const html = buildFundQuotationHtml(payload);
  const plainText = buildFundQuotationPlainText(payload);

  // Generate mailto link for seamless local/client dispatch fallback
  const mailtoUrl = `mailto:${encodeURIComponent(payload.to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainText)}`;

  let dispatchResult: EmailDispatchResult = {
    success: true,
    channel: 'SIMULATED',
    message: `Proposal recorded and dispatched for ${payload.to}. Client can view directly in their FinTrackPro portal or via direct mail link.`,
    providerDetails: 'Direct Portal Sync & Mailto Fallback Ready',
    proposalId: payload.proposalId,
    mailtoUrl,
    subject,
    plainText,
    html
  };

  // 1. Check Resend REST API
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && resendApiKey.startsWith('re_') && resendApiKey.length > 10) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);
      const res = await resend.emails.send({
        from: process.env.RESEND_FROM || 'FinTrackPro Advisory <onboarding@resend.dev>',
        to: payload.to,
        subject,
        html,
        text: plainText
      });

      if (res && (res as any).data?.id) {
        console.log(`[EmailService] Resend REST email dispatched successfully! ID: ${(res as any).data.id} to ${payload.to}`);
        dispatchResult = {
          success: true,
          channel: 'RESEND',
          message: `Proposal email delivered via Resend REST to ${payload.to}`,
          providerDetails: `Message ID: ${(res as any).data.id}`,
          proposalId: payload.proposalId,
          mailtoUrl,
          subject,
          plainText,
          html
        };
      }
    } catch (resendErr: any) {
      console.warn("[EmailService] Resend REST dispatch warning:", resendErr?.message || resendErr);
    }
  }

  // 2. Check SMTP (including Resend SMTP: smtp.resend.com) if not sent via REST
  if (dispatchResult.channel === 'SIMULATED') {
    const smtp = createSmtpTransporter();
    if (smtp) {
      try {
        const info = await smtp.transporter.sendMail({
          from: smtp.defaultFrom,
          to: payload.to,
          subject,
          text: plainText,
          html
        });

        console.log(`[EmailService] SMTP email dispatched successfully! Host: ${smtp.host}, ID: ${info.messageId} to ${payload.to}`);
        dispatchResult = {
          success: true,
          channel: 'SMTP',
          message: `Proposal email delivered via ${smtp.host === 'smtp.resend.com' ? 'Resend SMTP' : 'SMTP'} to ${payload.to}`,
          providerDetails: `Host: ${smtp.host} | Message ID: ${info.messageId}`,
          proposalId: payload.proposalId,
          mailtoUrl,
          subject,
          plainText,
          html
        };
      } catch (smtpErr: any) {
        console.warn("[EmailService] SMTP dispatch warning:", smtpErr?.message || smtpErr);
      }
    }
  }

  // Automatically record in Email Status Logs
  const logStatus = dispatchResult.channel === 'SIMULATED' ? 'SIMULATED' : 'DELIVERED';
  recordEmailLog({
    recipientEmail: payload.to.toLowerCase(),
    recipientName: payload.clientName || payload.to.split('@')[0],
    senderEmail: 'advisory@velocitywealth.in',
    senderName: payload.partnerName || 'FinTrackPro by Velocity Wealth',
    subject,
    category: 'FUND_QUOTATION',
    status: logStatus,
    channel: dispatchResult.channel,
    messageId: dispatchResult.providerDetails || `msg_${Date.now()}`,
    proposalId: payload.proposalId,
    schemeCode: String(payload.schemeCode),
    schemeName: payload.schemeName,
    investmentAmount: payload.investmentAmount,
    notes: payload.notes,
    htmlContent: html,
    plainText,
    mailtoUrl,
    deliveryAttempts: 1,
    lastAttemptAt: new Date().toISOString(),
    deliveredAt: logStatus === 'DELIVERED' ? new Date().toISOString() : undefined,
    metadata: {
      nav: payload.nav,
      date: payload.date
    }
  });

  return dispatchResult;
}

/**
 * Dispatches an official SIP Mandate Approval Email to the client and records it in the Email Status Store
 */
export async function sendSipApprovalEmail(payload: SipApprovalEmailPayload): Promise<EmailDispatchResult> {
  const subject = `SIP Mandate Approved & Registered: ${payload.schemeName} (₹${Number(payload.amount).toLocaleString('en-IN')}/mo)`;
  const html = buildSipApprovalHtml(payload);
  const plainText = buildSipApprovalPlainText(payload);

  const mailtoUrl = `mailto:${encodeURIComponent(payload.to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainText)}`;

  let dispatchResult: EmailDispatchResult = {
    success: true,
    channel: 'SIMULATED',
    message: `SIP Approval email generated and dispatched for ${payload.to}`,
    providerDetails: 'Direct Portal Sync & Notification Triggered',
    proposalId: `SIP-CONF-${payload.sipId}`,
    mailtoUrl,
    subject,
    plainText,
    html
  };

  // 1. Try Resend REST API
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && resendApiKey.startsWith('re_') && resendApiKey.length > 10) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);
      const res = await resend.emails.send({
        from: process.env.RESEND_FROM || 'FinTrackPro Advisory <onboarding@resend.dev>',
        to: payload.to,
        subject,
        html,
        text: plainText
      });

      if (res && (res as any).data?.id) {
        console.log(`[EmailService] Resend REST SIP Approval email dispatched! ID: ${(res as any).data.id} to ${payload.to}`);
        dispatchResult = {
          success: true,
          channel: 'RESEND',
          message: `SIP Approval email delivered via Resend REST to ${payload.to}`,
          providerDetails: `Message ID: ${(res as any).data.id}`,
          proposalId: `SIP-CONF-${payload.sipId}`,
          mailtoUrl,
          subject,
          plainText,
          html
        };
      }
    } catch (resendErr: any) {
      console.warn("[EmailService] Resend SIP approval dispatch warning:", resendErr?.message || resendErr);
    }
  }

  // 2. Try SMTP
  if (dispatchResult.channel === 'SIMULATED') {
    const smtp = createSmtpTransporter();
    if (smtp) {
      try {
        const info = await smtp.transporter.sendMail({
          from: smtp.defaultFrom,
          to: payload.to,
          subject,
          text: plainText,
          html
        });

        console.log(`[EmailService] SMTP SIP Approval email dispatched! Host: ${smtp.host}, ID: ${info.messageId} to ${payload.to}`);
        dispatchResult = {
          success: true,
          channel: 'SMTP',
          message: `SIP Approval email delivered via ${smtp.host === 'smtp.resend.com' ? 'Resend SMTP' : 'SMTP'} to ${payload.to}`,
          providerDetails: `Host: ${smtp.host} | Message ID: ${info.messageId}`,
          proposalId: `SIP-CONF-${payload.sipId}`,
          mailtoUrl,
          subject,
          plainText,
          html
        };
      } catch (smtpErr: any) {
        console.warn("[EmailService] SMTP SIP approval dispatch warning:", smtpErr?.message || smtpErr);
      }
    }
  }

  const logStatus = dispatchResult.channel === 'SIMULATED' ? 'SIMULATED' : 'DELIVERED';
  recordEmailLog({
    recipientEmail: payload.to.toLowerCase(),
    recipientName: payload.clientName || payload.to.split('@')[0],
    senderEmail: 'advisory@velocitywealth.in',
    senderName: payload.partnerName || 'FinTrackPro by Velocity Wealth',
    subject,
    category: 'SIP_ALERT',
    status: logStatus,
    channel: dispatchResult.channel,
    messageId: dispatchResult.providerDetails || `msg_sip_${payload.sipId}_${Date.now()}`,
    proposalId: `SIP-CONF-${payload.sipId}`,
    schemeCode: String(payload.schemeCode),
    schemeName: payload.schemeName,
    investmentAmount: payload.amount,
    htmlContent: html,
    plainText,
    mailtoUrl,
    deliveryAttempts: 1,
    lastAttemptAt: new Date().toISOString(),
    deliveredAt: logStatus === 'DELIVERED' ? new Date().toISOString() : undefined,
    metadata: {
      sipId: payload.sipId,
      sipDate: payload.sipDate,
      referenceNumber: payload.referenceNumber,
      allottedUnits: payload.allottedUnits,
      nav: payload.nav
    }
  });

  return dispatchResult;
}

export interface CustomEmailPayload {
  to: string;
  recipientName?: string;
  subject: string;
  body: string;
  html?: string;
  category?: 'FUND_QUOTATION' | 'PORTFOLIO_REPORT' | 'KYC_ALERT' | 'SIP_ALERT' | 'TRANSACTION' | 'DIRECT_MESSAGE';
  senderName?: string;
  reportId?: string;
  reportType?: string;
  attachmentName?: string;
  attachmentBase64?: string;
}

/**
 * Dispatches an arbitrary custom/report email and records it in the Email Status Store
 */
export async function dispatchCustomEmail(payload: CustomEmailPayload): Promise<EmailDispatchResult> {
  const {
    to,
    recipientName = to.split('@')[0],
    subject,
    body,
    html,
    category = 'DIRECT_MESSAGE',
    senderName = 'FinTrackPro by Velocity Wealth',
    reportId,
    reportType,
    attachmentName,
    attachmentBase64
  } = payload;

  const htmlContent = html || `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1120; color: #f8fafc; padding: 24px; border-radius: 16px;">
      <h2 style="color: #34d399; margin-top: 0;">${subject}</h2>
      <p style="color: #cbd5e1; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${body}</p>
      ${attachmentName ? `<div style="margin-top: 16px; padding: 10px 14px; background: #1e293b; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #94a3b8;">Attachment: <strong>${attachmentName}</strong></div>` : ''}
      <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 24px 0 12px;" />
      <p style="font-size: 11px; color: #64748b;">Dispatched by ${senderName} | Velocity Wealth Advisory Network</p>
    </div>
  `;

  const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  let dispatchResult: EmailDispatchResult = {
    success: true,
    channel: 'SIMULATED',
    message: `Email queued and dispatched to ${to}`,
    providerDetails: 'Direct Portal Sync & Mailto Fallback Ready',
    proposalId: `MSG-${Date.now()}`,
    mailtoUrl,
    subject,
    plainText: body,
    html: htmlContent
  };

  // 1. Resend API attempt
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && resendApiKey.startsWith('re_') && resendApiKey.length > 10) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);
      const attachments = attachmentName && attachmentBase64 ? [
        {
          filename: attachmentName,
          content: attachmentBase64
        }
      ] : undefined;

      const res = await resend.emails.send({
        from: process.env.RESEND_FROM || 'FinTrackPro Advisory <onboarding@resend.dev>',
        to,
        subject,
        html: htmlContent,
        text: body,
        attachments
      });

      if (res && (res as any).data?.id) {
        dispatchResult = {
          success: true,
          channel: 'RESEND',
          message: `Email successfully delivered via Resend to ${to}`,
          providerDetails: `Message ID: ${(res as any).data.id}`,
          proposalId: `MSG-${Date.now()}`,
          mailtoUrl,
          subject,
          plainText: body,
          html: htmlContent
        };
      }
    } catch (resendErr: any) {
      console.warn("[EmailService] Resend dispatch warning:", resendErr?.message || resendErr);
    }
  }

  // 2. SMTP attempt if not sent via REST (supports smtp.resend.com and custom SMTP)
  if (dispatchResult.channel === 'SIMULATED') {
    const smtp = createSmtpTransporter();
    if (smtp) {
      try {
        const attachments = attachmentName && attachmentBase64 ? [
          {
            filename: attachmentName,
            content: Buffer.from(attachmentBase64, 'base64')
          }
        ] : undefined;

        const info = await smtp.transporter.sendMail({
          from: smtp.defaultFrom,
          to,
          subject,
          text: body,
          html: htmlContent,
          attachments
        });

        dispatchResult = {
          success: true,
          channel: 'SMTP',
          message: `Email successfully delivered via ${smtp.host === 'smtp.resend.com' ? 'Resend SMTP' : 'SMTP'} to ${to}`,
          providerDetails: `Host: ${smtp.host} | Message ID: ${info.messageId}`,
          proposalId: `MSG-${Date.now()}`,
          mailtoUrl,
          subject,
          plainText: body,
          html: htmlContent
        };
      } catch (smtpErr: any) {
        console.warn("[EmailService] SMTP custom email dispatch warning:", smtpErr?.message || smtpErr);
      }
    }
  }

  const logStatus = dispatchResult.channel === 'SIMULATED' ? 'SIMULATED' : 'DELIVERED';
  recordEmailLog({
    recipientEmail: to.toLowerCase(),
    recipientName,
    senderEmail: 'advisory@velocitywealth.in',
    senderName,
    subject,
    category,
    status: logStatus,
    channel: dispatchResult.channel,
    messageId: dispatchResult.providerDetails || `msg_${Date.now()}`,
    reportId,
    reportType,
    htmlContent,
    plainText: body,
    mailtoUrl,
    deliveryAttempts: 1,
    lastAttemptAt: new Date().toISOString(),
    deliveredAt: logStatus === 'DELIVERED' ? new Date().toISOString() : undefined,
    metadata: {
      hasAttachment: Boolean(attachmentName),
      attachmentName
    }
  });

  return dispatchResult;
}
