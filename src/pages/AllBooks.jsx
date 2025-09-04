import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import BookCard from "../components/BookCard/BookCard";
import BookFilter from "../components/BookFilter/BookFilter";

const AllBooks = ({ darkMode }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5001/api/books/")
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch books');
        return res.json();
      })
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load books. Please try again later.');
        toast.error('Failed to load books');
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle URL search parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search")?.toLowerCase() || "";
    
    if (search && books.length > 0) {
      const searchFiltered = books.filter(
        (book) =>
          (book.title && book.title.toLowerCase().includes(search)) ||
          (book.author && book.author.toLowerCase().includes(search)) ||
          (book.category && book.category.toLowerCase().includes(search))
      );
      setFilteredBooks(searchFiltered);
    }
  }, [location.search, books]);

  const handleFilterChange = useCallback((filtered) => {
    setFilteredBooks(filtered);
  }, []);

  const handleEdit = (book) => toast.info(`Edit book: ${book.title}`);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold">Loading books...</h2>
          <p className="text-gray-500 mt-2">Please wait while we fetch the latest collection</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-4 text-red-500">{error}</h2>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} min-h-screen py-20`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4 drop-shadow-lg">
            Explore Our Collection
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Discover amazing books with advanced search and filtering options
          </p>
        </div>

        {/* Advanced Filter Component */}
        <BookFilter 
          books={books} 
          onFilterChange={handleFilterChange} 
          darkMode={darkMode} 
        />

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Showing {filteredBooks.length} of {books.length} books
          </p>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div
            className="grid gap-8 justify-center w-full"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            {filteredBooks.map((book) => (
              <div key={book._id} className="transform hover:scale-105 transition-transform duration-200">
                <BookCard
                  id={book._id}
                  title={book.title}
                  author={book.author}
                  price={book.price}
                  coverImageUrl={book.coverImageUrl}
                  category={book.category}
                  trending={book.trending}
                  averageRating={book.averageRating}
                  reviewCount={book.reviewCount}
                  stock={book.stock}
                  onEdit={() => handleEdit(book)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-50">📚</div>
            <h3 className="text-2xl font-semibold mb-2">No books found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your search criteria or browse all books
            </p>
            <button
              onClick={() => window.location.href = '/all-books'}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              View All Books
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllBooks;
