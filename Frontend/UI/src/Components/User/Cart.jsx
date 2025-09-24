import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import Navbar from '../User/navbar';
import Footer from './Footer';

const Cart = () => {
  const { cartItems, removeFromCart, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();
  const currency = "Rs ";
  const deliveryCharge = 200;
  
  // You'll need to fetch products or pass them to this component
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    // Fetch products for the cart
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products", { cache: "no-store" });
        const json = await res.json();
        const items = json.items || [];
        const normalized = items.map((p) => ({
          id: p.id || p._id,
          name: p.name,
          price: Number(p.price) || 0,
          img: (p.imageUrl || p.img || "").trim(),
        }));
        setProducts(normalized);
      } catch (e) {
        console.error("Failed to load products:", e);
      }
    })();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          
          <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-6 gap-4 text-white/70 text-sm font-medium pb-4 border-b border-white/10">
                <div className="col-span-2">Items</div>
                <div>Price</div>
                <div>Quantity</div>
                <div>Total</div>
                <div>Remove</div>
              </div>
              
              {products.filter(item => cartItems[item.id] > 0).map((item) => (
                <div key={item.id} className="grid grid-cols-6 gap-4 py-5 items-center border-b border-white/10">
                  <div className="col-span-2 flex items-center gap-4">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      className="h-16 w-16 rounded-lg object-cover border border-white/10"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                    </div>
                  </div>
                  <div>{currency}{item.price.toLocaleString()}</div>
                  <div>{cartItems[item.id]}</div>
                  <div>{currency}{(item.price * cartItems[item.id]).toLocaleString()}</div>
                  <div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 rounded-full hover:bg-white/10 transition"
                    >
                      <X size={18} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
              
              {Object.values(cartItems).filter(qty => qty > 0).length === 0 && (
                <div className="py-12 text-center text-white/60">
                  Your cart is empty
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-5">Cart Totals</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>{currency}{getTotalCartAmount(products).toLocaleString()}</p>
                </div>
                
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between">
                    <p>Delivery Fee</p>
                    <p>{currency}{getTotalCartAmount(products) === 0 ? 0 : deliveryCharge}</p>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-4 font-semibold text-lg">
                  <div className="flex justify-between">
                    <p>Total</p>
                    <p>{currency}{getTotalCartAmount(products) === 0 ? 0 : (getTotalCartAmount(products) + deliveryCharge).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
         <button
  onClick={() => navigate('/placeorder', { state: { cartItems, products } })}
  disabled={getTotalCartAmount(products) === 0}
  className="w-full mt-6 py-3 rounded-xl font-semibold bg-[#FBB01A] text-black hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
>
  PROCEED TO CHECKOUT
</button>


            </div>
            
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
              <div>
                <p className="text-white/80 mb-4">If you have a promo code, enter it here</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="promo code" 
                    className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]/30"
                  />
                  <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;