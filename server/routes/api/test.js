const express = require('express');
const router = express.Router();
const { sendEmail } = require('../../services/mailgun');
const data = {
  _id: '664b3b97fcd5b3bdbbcac24e'
  //   userName: 'John Doe',
  //   orderDetails: 'Order details here'
};

console.log(data);

router.get('/', async (req, res) => {
  result = await sendEmail(
    'shreshth45rock@gmail.com',
    'order-confirmation',
    '',
    data
  );
  console.log(result);
  res.status(200).send('sent email');
});

module.exports = router;
