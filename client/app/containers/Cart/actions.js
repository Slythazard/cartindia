/*
 *
 * Cart actions
 *
 */

import { push } from 'connected-react-router';
import { success } from 'react-notification-system-redux';
import axios from 'axios';

import {
  HANDLE_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  HANDLE_CART_TOTAL,
  SET_CART_ID,
  CLEAR_CART
} from './constants';

import {
  SET_PRODUCT_SHOP_FORM_ERRORS,
  RESET_PRODUCT_SHOP
} from '../Product/constants';

import { API_URL, CART_ID, CART_ITEMS, CART_TOTAL } from '../../constants';
import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { toggleCart } from '../Navigation/actions';

// Handle Add To Cart
export const handleAddToCart = product => {
  return async (dispatch, getState) => {
    console.log(product.quantity);
    product.quantity = Number(getState().product.productShopData.quantity);
    product.totalPrice = product.quantity * product.price;
    product.totalPrice = parseFloat(product.totalPrice.toFixed(2));
    const inventory = getState().product.storeProduct.inventory;

    const result = calculatePurchaseQuantity(inventory);

    const rules = {
      quantity: `min:1|max:${result}`
    };

    const { isValid, errors } = allFieldsValidation(product, rules, {
      'min.quantity': 'Quantity must be at least 1.',
      'max.quantity': `Quantity may not be greater than ${result}.`
    });

    if (!isValid) {
      return dispatch({ type: SET_PRODUCT_SHOP_FORM_ERRORS, payload: errors });
    }

    dispatch({
      type: RESET_PRODUCT_SHOP
    });

    dispatch({
      type: ADD_TO_CART,
      payload: product
    });

    const cartItems = JSON.parse(localStorage.getItem(CART_ITEMS));
    let newCartItems = [];
    if (cartItems) {
      newCartItems = [...cartItems, product];
    } else {
      newCartItems.push(product);
    }
    localStorage.setItem(CART_ITEMS, JSON.stringify(newCartItems));

    dispatch(calculateCartTotal());
    dispatch(saveCartToDatabase());
    dispatch(toggleCart());
  };
};

export const saveCartToDatabase = () => {
  return async (dispatch, getState) => {
    try {
      const cartItems = getState().cart.cartItems;
      const products = getCartItems(cartItems);
      const authenticated = getState().authentication.authenticated;

      if (products.length > 0) {
        let cartId = localStorage.getItem(CART_ID);
        let response;

        // getCartId();
        if (authenticated) {
          if (cartId) {
            // Update existing cart
            for (const product of products) {
              await axios.post(`${API_URL}/cart/add/${cartId}`, {
                product,
                user: authenticated ? getState().account.user._id : null
              });
            }
          } else {
            // Create new cart
            response = await axios.post(`${API_URL}/cart/add`, {
              products,
              user: authenticated ? getState().account.user._id : null
            });
            console.log(response);

            // Set the cart ID in localStorage and store
            dispatch(setCartId(response.data.cartId));
          }
        }

        // Show confirmation notification
        dispatch(
          success({
            title: 'Cart',
            message: 'Cart updated successfully!'
          })
        );
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// Handle Remove From Cart
export const handleRemoveFromCart = product => {
  return async (dispatch, getState) => {
    const state = getState();
    const cartId = state.cart.cartId;
    const productId = product._id;
    const auth = state.authentication.authenticated; // Assumes cartId is stored in Redux

    try {
      // Update backend cart
      if (auth) {
        await axios.delete(`${API_URL}/cart/delete/${cartId}/${productId}`);
        // Update localStorage (optional if you're syncing entirely via backend)
        const cartItems = JSON.parse(localStorage.getItem(CART_ITEMS)) || [];
        const newCartItems = cartItems.filter(item => item._id !== productId);
        localStorage.setItem(CART_ITEMS, JSON.stringify(newCartItems));
      } else {
        const cartItems = JSON.parse(localStorage.getItem(CART_ITEMS)) || [];
        const newCartItems = cartItems.filter(item => item._id !== productId);
        localStorage.setItem(CART_ITEMS, JSON.stringify(newCartItems));
      }

      dispatch({
        type: REMOVE_FROM_CART,
        payload: product
      });

      dispatch(calculateCartTotal());
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };
};

export const calculateCartTotal = () => {
  return (dispatch, getState) => {
    const cartItems = getState().cart.cartItems;

    let total = 0;

    cartItems.map(item => {
      total += item.price * item.quantity;
    });

    total = parseFloat(total.toFixed(2));
    localStorage.setItem(CART_TOTAL, total);
    dispatch({
      type: HANDLE_CART_TOTAL,
      payload: total
    });
  };
};

// set cart store from local storage
export const handleCart = () => {
  const cart = {
    cartItems: JSON.parse(localStorage.getItem(CART_ITEMS)),
    cartTotal: localStorage.getItem(CART_TOTAL),
    cartId: localStorage.getItem(CART_ID)
  };

  return (dispatch, getState) => {
    if (cart.cartItems != undefined) {
      dispatch({
        type: HANDLE_CART,
        payload: cart
      });
      dispatch(calculateCartTotal());
    }
  };
};

export const handleCheckout = () => {
  return (dispatch, getState) => {
    const authenticated = getState().authentication.authenticated;

    if (authenticated) {
      // For logged-in users, proceed directly to payment
      dispatch(placeOrder());
    } else {
      // For guests, show the checkout form
      dispatch(push('/login'));
      dispatch(
        success({
          title: 'Not Authenticated',
          message: 'Login before placing order'
        })
      );
    }

    dispatch(toggleCart());
  };
};

export const getCartId = () => {
  return async (dispatch, getState) => {
    try {
      const cartId = localStorage.getItem(CART_ID);
      const cartItems = getState().cart.cartItems;
      const products = getCartItems(cartItems);

      // create cart id if there is no one
      if (!cartId) {
        const response = await axios.post(`${API_URL}/cart/add`, { products });

        dispatch(setCartId(response.data.cartId));
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const setCartId = cartId => {
  return (dispatch, getState) => {
    localStorage.setItem(CART_ID, cartId);
    dispatch({
      type: SET_CART_ID,
      payload: cartId
    });
  };
};

export const clearCart = () => {
  return (dispatch, getState) => {
    localStorage.removeItem(CART_ITEMS);
    localStorage.removeItem(CART_TOTAL);
    localStorage.removeItem(CART_ID);

    dispatch({
      type: CLEAR_CART
    });
  };
};

const getCartItems = cartItems => {
  const newCartItems = [];
  cartItems.map(item => {
    const newItem = {};
    newItem.quantity = item.quantity;
    newItem.price = item.price;
    newItem.taxable = item.taxable;
    newItem.product = item._id;
    newCartItems.push(newItem);
  });

  return newCartItems;
};

const calculatePurchaseQuantity = inventory => {
  if (inventory <= 25) {
    return 1;
  } else if (inventory > 25 && inventory <= 100) {
    return 5;
  } else if (inventory > 100 && inventory < 500) {
    return 25;
  } else {
    return 50;
  }
};
