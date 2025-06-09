import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('[SendGrid] No API key provided - email functionality will not work');
}

export const sendEmail = async (msg: sgMail.MailDataRequired) => {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SendGrid API key not configured');
  }
  return sgMail.send(msg);
};

export default sgMail;