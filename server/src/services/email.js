const { Resend } = require('resend');

let resend = null;
function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

/**
 * Send a 6-digit verification code email.
 * Template is optimized for both dark and light mode email clients.
 */
async function sendVerificationCode(toEmail, code, displayName) {
  const codeStr = code.toString();
  const digits = codeStr.split('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="color-scheme" content="light dark"/>
<meta name="supported-color-schemes" content="light dark"/>
<title>Verify Your Email — TeslaVerse</title>
<style>
  :root { color-scheme: light dark; }
  body { margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
  
  /* Light mode default */
  .email-wrapper { background-color: #f4f4f7; }
  .email-card { background-color: #ffffff; border: 1px solid #e5e5e5; }
  .email-heading { color: #1a1a2e; }
  .email-text { color: #555770; }
  .email-text-muted { color: #8b8da3; }
  .digit-box { background-color: #f8f8fb; border: 2px solid #e0e0e8; color: #1a1a2e; }
  .email-divider { border-top: 1px solid #ececf0; }
  .email-footer-text { color: #a0a0b0; }

  /* Dark mode */
  @media (prefers-color-scheme: dark) {
    .email-wrapper { background-color: #0d0f18 !important; }
    .email-card { background-color: #161822 !important; border-color: rgba(255,255,255,0.08) !important; }
    .email-heading { color: #e8e8f0 !important; }
    .email-text { color: #b0b3c6 !important; }
    .email-text-muted { color: #6b6e85 !important; }
    .digit-box { background-color: #1e2030 !important; border-color: rgba(255,255,255,0.12) !important; color: #ffffff !important; }
    .email-divider { border-top-color: rgba(255,255,255,0.06) !important; }
    .email-footer-text { color: #4a4d62 !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;">
<div class="email-wrapper" style="padding:40px 16px;min-height:100%;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;max-width:480px;width:100%;">
    <tr>
      <td>
        <!-- Logo -->
        <div style="text-align:center;margin-bottom:32px;">
          <div style="display:inline-block;background:linear-gradient(135deg,#e82127,#c91a1f);width:48px;height:48px;border-radius:14px;line-height:48px;text-align:center;">
            <span style="color:#ffffff;font-size:24px;font-weight:800;">T</span>
          </div>
        </div>

        <!-- Card -->
        <div class="email-card" style="border-radius:16px;padding:40px 32px;text-align:center;">
          
          <!-- Icon -->
          <div style="margin-bottom:20px;">
            <span style="font-size:40px;">✉️</span>
          </div>

          <h1 class="email-heading" style="margin:0 0 8px;font-size:22px;font-weight:700;letter-spacing:-0.3px;">
            Verify Your Email
          </h1>
          
          <p class="email-text" style="margin:0 0 28px;font-size:15px;line-height:1.6;">
            Hey ${displayName || 'there'}! Enter this code to complete your TeslaVerse registration:
          </p>

          <!-- Code digits -->
          <div style="margin:0 0 28px;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>
                ${digits.map(d => `
                <td style="padding:0 4px;">
                  <div class="digit-box" style="width:44px;height:56px;border-radius:10px;font-size:24px;font-weight:700;line-height:56px;text-align:center;letter-spacing:0;">
                    ${d}
                  </div>
                </td>
                `).join('')}
              </tr>
            </table>
          </div>

          <p class="email-text-muted" style="margin:0 0 24px;font-size:13px;line-height:1.5;">
            This code expires in <strong style="color:inherit;">10 minutes</strong>. If you didn't create a TeslaVerse account, you can safely ignore this email.
          </p>

          <div class="email-divider" style="margin:24px 0;"></div>

          <p class="email-text-muted" style="margin:0;font-size:12px;">
            Having trouble? Reply to this email and we'll help you out.
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align:center;margin-top:24px;">
          <p class="email-footer-text" style="margin:0 0 4px;font-size:12px;">
            TeslaVerse &bull; tslaverse.online
          </p>
          <p class="email-footer-text" style="margin:0;font-size:11px;">
            You received this email because someone registered with your address.
          </p>
        </div>
      </td>
    </tr>
  </table>
</div>
</body>
</html>`;

  const { data, error } = await getResend().emails.send({
    from: 'TeslaVerse <noreply@tslaverse.online>',
    to: [toEmail],
    subject: `${codeStr} — Your TeslaVerse Verification Code`,
    html,
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error('Failed to send verification email');
  }

  return data;
}

module.exports = { sendVerificationCode };
