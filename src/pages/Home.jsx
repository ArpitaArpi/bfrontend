import { useEffect, useState } from "react";
import BookCard from "../components/BookCard/BookCard";

const Home = ({ darkMode }) => {
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/books?trending=true")
      .then((res) => res.json())
      .then((data) => setTrendingBooks(data))
      .catch((err) => console.error(err));

    fetch("http://localhost:5001/api/books/best-sellers")
      .then((res) => res.json())
      .then((data) => setBestSellers(data))
      .catch((err) => console.error(err));

    fetch("http://localhost:5001/api/books/new-arrivals")
      .then((res) => res.json())
      .then((data) => setNewArrivals(data))
      .catch((err) => console.error(err));

    fetch("http://localhost:5001/api/books/special-offers")
      .then((res) => res.json())
      .then((data) => setSpecialOffers(data))
      .catch((err) => console.error(err));
  }, []);

  const sections = [
    { title: "🔥 Trending Now", books: trendingBooks, gradient: "from-pink-500 via-red-500 to-yellow-500" },
    { title: "🏆 Best Sellers", books: bestSellers, gradient: "from-indigo-500 via-blue-500 to-cyan-500" },
    { title: "✨ New Arrivals", books: newArrivals, gradient: "from-green-500 via-teal-500 to-emerald-500" },
    { title: "💰 Special Offers", books: specialOffers, gradient: "from-purple-500 via-fuchsia-500 to-pink-500" },
  ];

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Hero Section */}
      <section className="relative py-24 text-center bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
            Discover Your Next Favorite Book 📚
          </h1>
          <p className="text-lg mb-8 opacity-90">
            Thousands of books waiting for you. Browse, explore, and enjoy.
          </p>
          <a
            href="/all-books"
            className="px-8 py-4 bg-yellow-400 text-black rounded-full font-semibold text-lg shadow-lg hover:scale-105 transition"
          >
            Browse All Books
          </a>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </section>

      {/* Dynamic Sections */}
      {sections.map((section, idx) => (
        <section key={idx} className="relative py-20 text-white">
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-r ${section.gradient} opacity-90`} />
          <div className="absolute inset-0 bg-black/30" /> {/* Overlay for readability */}

          <div className="relative max-w-7xl mx-auto px-6 z-10">
            <h2 className="text-4xl font-bold mb-12 text-center drop-shadow-lg">
              {section.title}
            </h2>

            {/* Coupon Highlight ONLY for Special Offers */}
            {section.title.includes("Special Offers") && (
              <div className="mb-12 text-center">
                <div className="inline-block px-10 py-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-black rounded-2xl shadow-2xl border-4 border-white/80 animate-pulse">
                  🎉 <span className="font-bold text-lg">Use coupon code</span>{" "}
                  <span className="bg-black text-yellow-300 px-3 py-1 rounded-lg font-extrabold mx-2 tracking-wider">
                    NAFIU
                  </span>{" "}
                  <span className="text-white font-bold">for 20% OFF!</span>
                </div>
              </div>
            )}

            {/* Book Cards */}
            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {section.books.map((book) => (
                <div key={book._id} className="transform hover:scale-105 transition">
                  <BookCard {...book} id={book._id} />
                </div>
              ))}
            </div>

            {/* View All Offers */}
            {section.title.includes("Offers") && (
              <div className="text-center mt-12">
                <a
                  href="/offers"
                  className="inline-block px-8 py-4 bg-yellow-400 text-black rounded-full font-semibold shadow-md hover:scale-105 transition"
                >
                  View All Offers
                </a>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;
