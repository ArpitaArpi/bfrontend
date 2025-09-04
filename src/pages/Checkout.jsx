import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { clearCart } from '../store/cartSlice';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No order data found</h2>
          <button
            onClick={() => navigate('/cart')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  // Handle both cart checkout and single book checkout
  const isCartCheckout = !!state.cartItems;
  const items = isCartCheckout ? state.cartItems : [state.book];
  const total = state.total || state.finalPrice || (state.book?.price || 0);
  const discount = state.discount || 0;
  const finalTotal = state.finalTotal || total;
  const couponCode = state.couponCode || state.coupon;

  const handleConfirmPayment = async () => {
    try {
      // Simulate payment processing
      const orderData = {
        items: items.map(item => ({
          bookId: item._id || item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity || 1
        })),
        total: finalTotal,
        discount: discount,
        couponCode: couponCode,
        orderDate: new Date().toISOString(),
        status: 'pending'
      };

      // Here you would normally send the order to your backend
      console.log('Order submitted:', orderData);
      
      // Clear cart if it was a cart checkout
      if (isCartCheckout) {
        dispatch(clearCart());
      }
      
      toast.success('✅ Order placed successfully!');
      
      // Redirect to order confirmation or home
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('❌ Payment failed. Please try again.');
    }
  };

  return (
    <section className="min-h-screen py-20 bg-gradient-to-b from-purple-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold mb-8 text-purple-700 text-center">Checkout</h1>
          
          {/* Order Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.coverImageUrl || "https://placehold.co/60x80?text=No+Image"}
                      alt={item.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.author}</p>
                      {item.quantity && item.quantity > 1 && (
                        <p className="text-sm text-indigo-600">Quantity: {item.quantity}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-indigo-600">
                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <>
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({couponCode}):</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                </>
              )}
              
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-purple-700">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method (Simulated) */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-indigo-700">Payment Method</h3>
            <div className="p-4 border border-gray-300 rounded-lg bg-yellow-50">
              <p className="text-sm text-gray-600 mb-2">
                💳 <strong>Simulated Payment</strong> - This is a demo checkout
              </p>
              <p className="text-xs text-gray-500">
                No real payment will be processed
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate(isCartCheckout ? '/cart' : `/books/${items[0]?.id || items[0]?._id}`)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Back to {isCartCheckout ? 'Cart' : 'Book'}
            </button>
            
            <button
              onClick={handleConfirmPayment}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:brightness-110 transition-transform transform hover:scale-105"
            >
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
