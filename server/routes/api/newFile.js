const Order = require('../../models/order');
const Cart = require('../../models/cart');
const { auth } = require('../../middleware/auth');
const mailgun = require('../../services/mailgun');
const { router } = require('./order');

router.post('/add', auth, async (req, res) => {
  try {
    const cart = req.body.cartId;
    const total = req.body.total;
    const user = req.body.user;
    const address = req.body.address;
    const paymentId = req.body.paymentId;
    const razorpayOrderId = req.body.razorpayOrderId;

    console.log(req.body);

    const order = new Order({
      cart,
      user,
      total,
      address,
      paymentId,
      razorpayOrderId,
      paymentStatus: 'Paid'
    });

    const orderDoc = await order.save();

    try {
      const cartDoc = await Cart.findById(orderDoc.cart._id).populate({
        path: 'products.product',
        populate: {
          path: 'brand'
        }
      });
    } catch (error) {
      res.status(400).json({
        error: error
      });
    }

    const newOrder = {
      _id: orderDoc._id,
      created: orderDoc.created,
      user: orderDoc.user,
      total: orderDoc.total,
      products: cartDoc.products,
      address: orderDoc.address, // include this if needed

      // paymentId: orderDoc.paymentId, // include this if needed
      // razorpayOrderId: orderDoc.razorpayOrderId,
      paymentStatus: orderDoc.paymentStatus
    };

    await mailgun.sendEmail(order.user.email, 'order-confirmation', newOrder);

    res.status(200).json({
      success: true,
      message: `Your order has been placed successfully!`,
      order: { _id: orderDoc._id }
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});
