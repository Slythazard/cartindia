const express = require('express');
const router = express.Router();

// Bring in Models & Utils
const Cart = require('../../models/cart');
const Product = require('../../models/product');
const { auth } = require('../../middleware/auth');
const store = require('../../utils/store');

router.post('/add', auth, async (req, res) => {
  try {
    const user = req.user._id;
    const items = req.body.products;

    const products = store.caculateItemsSalesTax(items);

    const cart = new Cart({
      user,
      products
    });

    const cartDoc = await cart.save();

    decreaseQuantity(products);

    res.status(200).json({
      success: true,
      cartId: cartDoc.id
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.delete('/delete/:cartId', auth, async (req, res) => {
  try {
    await Cart.deleteOne({ _id: req.params.cartId });

    res.status(200).json({
      success: true
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.post('/add/:cartId', auth, async (req, res) => {
  try {
    const item = req.body.product;

    if (
      !item ||
      !item.product || // required: ID of product
      !item.quantity ||
      !item.price
    ) {
      return res.status(400).json({
        success: false,
        error: 'Missing required product fields.',
        received: item
      });
    }

    const products = store.caculateItemsSalesTax([item]);
    const newProduct = products[0];

    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }

    const existingProduct = cart.products.find(
      p => p.product.toString() === newProduct.product.toString()
    );

    if (existingProduct) {
      existingProduct.quantity += newProduct.quantity;
      existingProduct.price += newProduct.price;
    } else {
      cart.products.push(newProduct);
    }

    await cart.save();

    res.status(200).json({
      success: true
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.delete('/delete/:cartId/:productId', auth, async (req, res) => {
  try {
    const product = { product: req.params.productId };
    const query = { _id: req.params.cartId };

    await Cart.updateOne(query, { $pull: { products: product } }).exec();

    res.status(200).json({
      success: true
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

const decreaseQuantity = products => {
  let bulkOptions = products.map(item => {
    return {
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity } }
      }
    };
  });

  Product.bulkWrite(bulkOptions);
};

module.exports = router;
