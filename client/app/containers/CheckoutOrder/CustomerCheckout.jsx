import React,{ useState,useEffect}from 'react';
import { connect } from 'react-redux';
import './CustomerCheckout.css';
import {addOrder} from '../Order/actions' 


const CustomerCheckout = props => {
    const { user,cartItems } = props;

    console.log(user)

    const[formData,setFormData]=useState({
        firstName:'',
        lastName:'',
        email:'',
        phoneNumber:'',
        address:{
            addressLine1:'',
            addressLine2:'',
            city:'',
            state:'',
            country:'',
            pincode:'',
        }
    })

    useEffect(()=>{   
        if (user) {
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          address: {
            addressLine1: user.address?.addressLine1 || '',
            addressLine2: user.address?.addressLine2 || '',
            city: user.address?.city || '',
            state: user.address?.state || '',
            country:user.address?.country||'',
            pincode: user.address?.pincode || ''}})
          }},[user])

    let totalPrice = 0
    let shippingFee = 0
    console.log(cartItems)

    cartItems.forEach(element => {
        totalPrice += element.price*element.quantity
    });

    const handleChange=(e)=>{
        const { name, value } = e.target;
        if (["addressLine1", "addressLine2", "city", "state","country","pincode"].includes(name)) {
            setFormData(prevState => ({
                ...prevState,
                address: {
                    ...prevState.address,
                    [name]: value
                }
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        props.addOrder(formData.address);
    }

  return (
    <div className="checkout-page-head">
      <h2>Checkout</h2>
      
      <div className='checkout-page'>
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <img src={item.imageUrl?item.imageUrl:"../../../public/images/placeholder-image.png"} alt={item.name} className='checkout-img' />
                  <div className='cart-item-detail'>
                    <h4>{item.name}</h4>
                    <p>Price: ₹{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))
            )}
            <div>
            <div className="sub-total finalCalc"><p>Sub Total</p><p>₹{totalPrice}</p></div>  
            <div className='finalCalc'><p>Shipping</p> <p>₹{shippingFee}</p></div>
            <div className='finalCalc'><h3>Total Price</h3> <h3>₹{totalPrice+shippingFee}</h3></div>
            </div>
          </div>        
          <form onSubmit={handleSubmit} className='Details'>
            <div className='fullname'>
                <input name='firstName' type="text" placeholder='first name' value={formData.firstName}  onChange={handleChange}required/>
                <input name="lastName" type="text" placeholder='last name' value={formData.lastName}  onChange={handleChange}/>
            </div>
            <input name='email' type="email" placeholder='Email' className='email input-first-3' value={formData.email}  onChange={handleChange}/>
            <input name='phoneNumber' type="tel" placeholder='Phone No.'value={formData.phoneNumber}  onChange={handleChange} className='finalCalc email' />
            <input name='addressLine1' type="text" placeholder='address line 1'value={formData.address.addressLine1}  onChange={handleChange}required/>
            <input name='addressLine2' type="text" placeholder='address line 2(optional)'value={formData.address.addressLine2}  onChange={handleChange}/>
            <input name='city' type="text" placeholder='City'value={formData.address.city}  onChange={handleChange}/>
            <input name='state' type="text" placeholder='State' value={formData.address.state}  onChange={handleChange}/>
            <input name='country' type="text" placeholder='country' value={formData.address.country}  onChange={handleChange}/>
            <input name='pincode' type="text" placeholder='pincode'value={formData.address.pincode}  onChange={handleChange} />
            <button type='submit' className='btn-checkout'>Proceed to Payment</button> 
          </form>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  cartItems: state.cart.cartItems,
  user: state.account.user  // <<== make sure this matches your redux structure
});

export default connect(mapStateToProps,{addOrder})(CustomerCheckout);
