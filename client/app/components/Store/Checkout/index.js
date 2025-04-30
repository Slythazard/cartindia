import React from 'react';
import { useSelector } from 'react-redux';
import Button from '../../Common/Button/index.js';

const Checkout = props => {
  const { authenticated, handleShopping, handleCheckout, placeOrder } = props;
  return (
    <div className='easy-checkout'>
      {authenticated ? (
        <div className='checkout-actions'>
          <Button
            variant='primary'
            text='Continue shopping'
            onClick={() => handleShopping()}
          />
          <Button
            variant='primary'
            text='Place Order'
            onClick={() => placeOrder()}
          />
        </div>
      ) : (
        <div className='checkout-actions'>
          <Button
            variant='primary'
            text='Continue shopping'
            onClick={() => handleShopping()}
          />
          <Button
            variant='primary'
            text='Place Order'
            onClick={() => handleCheckout()}
          />
        </div>
      )}
      ;
    </div>
  );
};
export default Checkout;
