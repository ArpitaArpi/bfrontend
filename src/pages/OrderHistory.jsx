import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { FaBox, FaCalendarAlt, FaDollarSign, FaEye, FaTruck } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      // In a real app, this would fetch from your backend API
      const response = await fetch(`http://localhost:5001/api/orders/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        // Mock data for demonstration
        const mockOrders = [
          {
            _id: '1',
            orderDate: '2024-01-15T10:30:00Z',
            status: 'delivered',
            total: 45.99,
            items: [
              {
                bookId: '1',
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                price: 15.99,
                quantity: 1,
                coverImageUrl: 'https://placehold.co/200x300?text=Gatsby'
              },
              {
                bookId: '2',
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                price: 14.99,
                quantity: 2,
                coverImageUrl: 'https://placehold.co/200x300?text=Mockingbird'
              }
            ],
            shippingAddress: {
              street: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001'
            }
          },
          {
            _id: '2',
            orderDate: '2024-01-10T14:20:00Z',
            status: 'shipped',
            total: 29.99,
            items: [
              {
                bookId: '3',
                title: '1984',
                author: 'George Orwell',
                price: 12.99,
                quantity: 1,
                coverImageUrl: 'https://placehold.co/200x300?text=1984'
              },
              {
                bookId: '4',
                title: 'Pride and Prejudice',
                author: 'Jane Austen',
                price: 16.99,
                quantity: 1,
                coverImageUrl: 'https://placehold.co/200x300?text=Pride'
              }
            ]
          },
          {
            _id: '3',
            orderDate: '2024-01-05T09:15:00Z',
            status: 'pending',
            total: 22.50,
            items: [
              {
                bookId: '5',
                title: 'The Catcher in the Rye',
                author: 'J.D. Salinger',
                price: 22.50,
                quantity: 1,
                coverImageUrl: 'https://placehold.co/200x300?text=Catcher'
              }
            ]
          }
        ];
        setOrders(mockOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaBox className="text-yellow-600" />;
      case 'processing':
        return <FaBox className="text-blue-600" />;
      case 'shipped':
        return <FaTruck className="text-indigo-600" />;
      case 'delivered':
        return <FaTruck className="text-green-600" />;
      default:
        return <FaBox className="text-gray-600" />;
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FaBox className="text-6xl text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No Orders Yet</h1>
          <p className="text-gray-600 mb-8">
            You haven't placed any orders yet. Start browsing our collection!
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
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="mt-2 text-gray-600">Track your book orders and purchases</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order._id.slice(-8)}
                  </h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <FaCalendarAlt className="mr-2" />
                    <span>{formatDate(order.orderDate)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <FaDollarSign className="text-gray-600 mr-1" />
                    <span className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</span>
                  </div>
                  
                  <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-2 capitalize">{order.status}</span>
                  </div>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="flex items-center space-x-4 mb-4">
                {order.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <img
                      src={item.coverImageUrl || 'https://placehold.co/40x50?text=Book'}
                      alt={item.title}
                      className="w-8 h-10 object-cover rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                        {item.title}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      )}
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <span className="text-sm text-gray-500">
                    +{order.items.length - 3} more items
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleViewOrder(order)}
                  className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <FaEye className="mr-2" />
                  View Details
                </button>
                
                {order.status === 'delivered' && (
                  <Link
                    to={`/books/${order.items[0]?.bookId}`}
                    className="text-sm bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Write Review
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Order Info */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Order Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-medium">#{selectedOrder._id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-medium">{formatDate(selectedOrder.orderDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-medium text-lg">${selectedOrder.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Items Ordered</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                        <img
                          src={item.coverImageUrl || 'https://placehold.co/60x80?text=Book'}
                          alt={item.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{item.title}</h5>
                          <p className="text-sm text-gray-600">by {item.author}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Shipping Address</h4>
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                        {selectedOrder.shippingAddress.zipCode}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end pt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;