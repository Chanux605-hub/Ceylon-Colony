import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './navbar';
import Footer from './Footer';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { cartItems, products } = location.state || {}; // coming from Cart
  const [payment, setPayment] = useState('cod'); // COD or Stripe
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    firstName: '', lastName: '', email: '', street: '',
    city: '', state: '', zipcode: '', country: '', phone: ''
  });

  useEffect(() => {
    if (!cartItems || Object.keys(cartItems).length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const getTotalCartAmount = () => {
    if (!cartItems || !products) return 0;
    return products.reduce(
      (total, item) => total + (item.price * (cartItems[item.id] || 0)), 
      0
    );
  };

  const placeOrder = async () => {
    if (!cartItems || Object.keys(cartItems).length === 0) {
      return toast.error('Cart is empty');
    }

    const orderItems = products
      .filter(item => cartItems[item.id] > 0)
      .map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: cartItems[item.id],
        img: item.img
      }));

    const storedUser = (() => {
      try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
    })();
    const orderData = {
      userId:
        (user && (user._id || user.email)) ||
        (storedUser && (storedUser._id || storedUser.email)) ||
        'guest',
      items: orderItems,
      amount: getTotalCartAmount() + 200, // delivery fee
      address: data,
      paymentMethod: payment
    };

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:3000/api/orderdetails/create', 
        orderData
      );

      if (response.data.success) {
        toast.success('Order placed successfully!');
        navigate('/dashboard/orders');
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error(error);

      // 🔔 Retry notification
      toast.error(
        <div>
          Server error, please try again. <br />
          <button
            onClick={() => placeOrder()} 
            className="mt-2 bg-yellow-400 text-black px-3 py-1 rounded"
          >
            Retry
          </button>
        </div>,
        { autoClose: false } // keep toast until dismissed
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    placeOrder();
  };

  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 p-6 max-w-7xl mx-auto">
        {/* Delivery Info */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Delivery Information</h2>
          <div className="flex gap-4 mb-4">
            <input 
              type="text" name="firstName" value={data.firstName} onChange={onChangeHandler} 
              placeholder="First Name" required 
              pattern="[A-Za-z]{2,}" 
              title="First name should contain only letters and be at least 2 characters long"
              className="flex-1 border border-gray-300 rounded px-3 py-2" 
            />
            <input 
              type="text" name="lastName" value={data.lastName} onChange={onChangeHandler} 
              placeholder="Last Name" required 
              pattern="[A-Za-z]{2,}" 
              title="Last name should contain only letters and be at least 2 characters long"
              className="flex-1 border border-gray-300 rounded px-3 py-2" 
            />
          </div>
          <input 
            type="email" name="email" value={data.email} onChange={onChangeHandler} 
            placeholder="Email" required 
            className="w-full mb-4 border border-gray-300 rounded px-3 py-2" 
          />
          <input 
            type="text" name="street" value={data.street} onChange={onChangeHandler} 
            placeholder="Street" required 
            minLength="2"
            className="w-full mb-4 border border-gray-300 rounded px-3 py-2" 
          />
          <div className="flex gap-4 mb-4">
            <input 
              type="text" name="city" value={data.city} onChange={onChangeHandler} 
              placeholder="City" required 
              minLength="2"
              className="flex-1 border border-gray-300 rounded px-3 py-2" 
            />
            <input 
              type="text" name="state" value={data.state} onChange={onChangeHandler} 
              placeholder="State" required 
              minLength="2"
              className="flex-1 border border-gray-300 rounded px-3 py-2" 
            />
          </div>
          <div className="flex gap-4 mb-4">
            <input 
              type="text" name="zipcode" value={data.zipcode} onChange={onChangeHandler} 
              placeholder="Zip Code" required 
              pattern="[0-9]{4,6}" 
              title="Zip code should be 4–6 digits"
              className="flex-1 border border-gray-300 rounded px-3 py-2" 
            />
            <input 
              type="text" name="country" value={data.country} onChange={onChangeHandler} 
              placeholder="Country" required 
              minLength="2"
              className="flex-1 border border-gray-300 rounded px-3 py-2" 
            />
          </div>
          <input 
            type="tel" name="phone" value={data.phone} onChange={onChangeHandler} 
            placeholder="Phone" required 
            pattern="[0-9]{10,15}" 
            title="Phone number should be 10–15 digits"
            className="w-full mb-4 border border-gray-300 rounded px-3 py-2" 
          />
        </div>

        {/* Payment */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
            <div onClick={() => setPayment('cod')} className={`flex items-center gap-3 mb-3 cursor-pointer p-2 border rounded ${payment === 'cod' ? 'border-yellow-400' : 'border-gray-300'}`}>
              <p>COD (Cash on delivery)</p>
            </div>
            <div onClick={() => setPayment('stripe')} className={`flex items-center gap-3 mb-3 cursor-pointer p-2 border rounded ${payment === 'stripe' ? 'border-yellow-400' : 'border-gray-300'}`}>
              <p>Stripe (Credit / Debit)</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded shadow-lg transition disabled:opacity-50"
          >
            {loading ? 'Placing order...' : payment === 'cod' ? 'Place Order' : 'Proceed To Payment'}
          </button>
        </div>
      </form>
      <Footer />
    </>
  );
};

export default PlaceOrder;
