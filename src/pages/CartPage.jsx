import { useEffect, useState } from 'react';
import { FaMinus, FaPlus, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { applyCoupon, clearCart, removeCoupon, removeFromCart, updateQuantity } from '../store/cartSlice';

const CartPage = ({ darkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, itemCount, discount, couponCode, finalTotal } = useSelector((state) => state.cart);
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState('');

  useEffect(() => {
    if (couponCode) {
      setCouponInput(couponCode);
    }
  }, [couponCode]);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity >= 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart({ bookId: id }));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  const handleApplyCoupon = () => {
    const validCoupons = {
      'NAFIU': 20,
      'WELCOME10': 10,
      'SAVE15': 15,
      'BOOKBAZAR': 25
    };

    const upperCoupon = couponInput.toUpperCase();
    
    if (validCoupons[upperCoupon]) {
      dispatch(applyCoupon({ 
        couponCode: upperCoupon, 
        discountPercent: validCoupons[upperCoupon]
      }));
      setCouponMessage(`Coupon applied! ${validCoupons[upperCoupon]}% off`);
    } else {
      setCouponMessage('Invalid coupon code');
      setTimeout(() => setCouponMessage(''), 3000);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponInput('');
    setCouponMessage('');
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }
    navigate('/checkout', { 
      state: { 
        cartItems: items, 
        total: total,
        discount: discount || 0,
        finalTotal: finalTotal || total,
        couponCode: couponCode || null
      } 
    });
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen py-20 transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FaShoppingCart className={`text-6xl mx-auto mb-6 ${
            darkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className={`mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Looks like you haven't added any books to your cart yet.
          </p>
          <Link
            to="/all-books"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-20 transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className={`text-sm font-medium transition-colors ${
              darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
            }`}
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className={`rounded-lg shadow-md p-6 transition-colors duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex items-center space-x-4">
                  {/* Book Image */}
                  <img
                    src={item.coverImageUrl || 'https://placehold.co/80x100?text=No+Image'}
                    alt={item.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                  
                  {/* Book Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>by {item.author}</p>
                    {item.category && (
                      <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${
                        darkMode 
                          ? 'bg-indigo-900 text-indigo-300' 
                          : 'bg-indigo-100 text-indigo-600'
                      }`}>
                        {item.category}
                      </span>
                    )}
                    <p className={`text-lg font-bold mt-2 ${
                      darkMode ? 'text-indigo-400' : 'text-indigo-600'
                    }`}>${item.price}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className={`p-2 rounded-full transition ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus className="text-sm" />
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className={`p-2 rounded-full transition ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                    >
                      <FaPlus className="text-sm" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className={`mt-2 transition-colors ${
                        darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
                      }`}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`rounded-lg shadow-md p-6 sticky top-4 transition-colors duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Items ({itemCount}):</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <>
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({couponCode}):</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <button
                        onClick={handleRemoveCoupon}
                        className={`text-sm transition-colors ${
                          darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
                        }`}
                      >
                        Remove Coupon
                      </button>
                    </div>
                  </>
                )}
                
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${(finalTotal || total).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Coupon Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon code"
                    className={`flex-1 px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    disabled={!!couponCode}
                  />
                  {!couponCode ? (
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                    >
                      Apply
                    </button>
                  ) : (
                    <button
                      onClick={handleRemoveCoupon}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {couponMessage && (
                  <p className={`text-sm mt-1 ${
                    couponMessage.includes('Invalid') ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {couponMessage}
                  </p>
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <Link
                to="/all-books"
                className={`block text-center mt-4 font-medium transition-colors ${
                  darkMode 
                    ? 'text-indigo-400 hover:text-indigo-300'
                    : 'text-indigo-600 hover:text-indigo-800'
                }`}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;