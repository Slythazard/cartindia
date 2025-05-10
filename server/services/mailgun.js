const formData = require('form-data');
const Mailgun = require('mailgun.js');
require('dotenv').config();
const template = require('../config/template');
const keys = require('../config/keys');

const { key, domain, sender } = keys.mailgun;

// console.log({ key, domain, sender });

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: key
});

console.log('Mailgun initialized:', !!mailgun);

// exports.sendEmail(
//   'your@email.com',
//   'reset',
//   'localhost:3000',
//   'test-reset-token'
// );

exports.sendEmail = async (email, type, host, data) => {
  try {
    const message = prepareTemplate(type, host, data);

    // console.log(message);

    const config = {
      from: `CARTINDIA <${sender}>`,
      to: email,
      subject: message.subject,
      text: message.text
    };

    // console.log('Sending mail with config:', config);

    return await mg.messages.create(domain, config);
  } catch (error) {
    return error;
  }
};

const prepareTemplate = (type, host, data) => {
  let message;

  switch (type) {
    case 'reset':
      message = template.resetEmail(host, data);
      break;

    case 'reset-confirmation':
      message = template.confirmResetPasswordEmail();
      break;

    case 'signup':
      message = template.signupEmail(data);
      break;

    case 'merchant-signup':
      message = template.merchantSignup(host, data);
      break;

    case 'merchant-welcome':
      message = template.merchantWelcome(data);
      break;

    case 'newsletter-subscription':
      message = template.newsletterSubscriptionEmail();
      break;

    case 'contact':
      message = template.contactEmail();
      break;

    case 'merchant-application':
      message = template.merchantApplicationEmail();
      break;

    case 'merchant-deactivate-account':
      message = template.merchantDeactivateAccount();
      break;

    case 'order-confirmation':
      message = template.orderConfirmationEmail(data);
      break;

    default:
      message = '';
  }

  return message;
};
