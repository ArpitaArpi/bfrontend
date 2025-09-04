import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Order = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5001/api/books/${id}`)
      .then(res => res.json())
      .then(data => {
        setBook(data);
        setFinalPrice(data.price || 0);

        if (data.coupon && data.coupon.toLowerCase() === "nafiu") {
          setCoupon("nafiu");
          const discountAmount = data.price * 0.2;
          setDiscount(discountAmount);
          setFinalPrice(data.price - discountAmount);
          setCouponMessage("🔥 Special offer applied!");
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleApplyCoupon = () => {
    if (coupon && book.coupon && coupon.toLowerCase() === book.coupon.toLowerCase()) {
      const discountAmount = book.price * 0.2;
      setDiscount(discountAmount);
      setFinalPrice(book.price - discountAmount);
      setCouponMessage("Coupon applied successfully! 🎉");
    } else {
      setDiscount(0);
      setFinalPrice(book.price);
      setCouponMessage("Invalid coupon code. ❌");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { book, finalPrice, discount, coupon } });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-700 dark:text-gray-200">Loading...</div>;
  if (!book) return <div className="min-h-screen flex items-center justify-center text-xl text-red-600 dark:text-red-400">Book not found</div>;

  return (
    <section className={`min-h-screen py-20 flex justify-center items-center ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className={`max-w-2xl w-full rounded-3xl shadow-2xl p-8 flex flex-col items-center transition-colors duration-300 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
        
        {/* Book Header */}
        <h1 className="text-3xl font-bold mb-6 text-center">{book.title}</h1>
        <p className="text-gray-500 dark:text-gray-300 mb-4">{book.author}</p>

        {/* Book Image */}
        <img
          src={book.coverImageUrl || "https://placehold.co/220x300?text=No+Image"}
          alt={book.title}
          className="h-64 w-auto rounded-2xl shadow-lg mb-6 object-cover"
        />

        {/* Price */}
        <div className="flex flex-col items-center mb-6">
          <p className="text-lg font-medium">
            Price: <span className="font-bold text-indigo-600 dark:text-indigo-400">{book.price ? `$${book.price}` : "Contact for price"}</span>
          </p>
          {discount > 0 && (
            <p className="text-green-500 font-semibold mt-1">Discount applied: ${discount.toFixed(2)}</p>
          )}
          <p className="text-2xl font-bold mt-2">Total: ${finalPrice.toFixed(2)}</p>
        </div>

        {/* Coupon Input */}
        <div className="w-full mb-6">
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Have a coupon?</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Enter coupon code"
              className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
            />
            <button
              onClick={handleApplyCoupon}
              className="px-4 py-2 rounded-lg bg-yellow-500 text-gray-900 font-semibold hover:brightness-110 transition"
            >
              Apply
            </button>
          </div>
          {couponMessage && (
            <p className={`mt-2 font-semibold ${couponMessage.includes("Invalid") ? "text-red-600" : "text-green-500"}`}>{couponMessage}</p>
          )}
        </div>

        {/* Description */}
        {book.description && (
          <div className="mb-6 w-full">
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className={`text-gray-700 dark:text-gray-300`}>{book.description}</p>
          </div>
        )}

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-semibold shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
        >
          Proceed to Checkout
        </button>
      </div>
    </section>
  );
};

export default Order;
