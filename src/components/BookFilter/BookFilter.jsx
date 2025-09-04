import { useEffect, useState } from 'react';

const BookFilter = ({ books, onFilterChange, darkMode }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'title',
    sortOrder: 'asc',
    inStock: false,
    rating: 0
  });

  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  useEffect(() => {
    if (books.length > 0) {
      // Extract unique categories
      const uniqueCategories = [...new Set(books.map(book => book.category).filter(Boolean))];
      setCategories(uniqueCategories);

      // Calculate price range
      const prices = books.map(book => book.price).filter(price => price > 0);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange({ min: minPrice, max: maxPrice });
      setFilters(prev => ({ ...prev, minPrice, maxPrice }));
    }
  }, [books]);

  useEffect(() => {
    // Apply filters whenever filters change
    const filteredBooks = applyFilters(books, filters);
    onFilterChange(filteredBooks);
  }, [filters, books, onFilterChange]);

  const applyFilters = (books, filters) => {
    let filtered = [...books];

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(book => 
        book.title?.toLowerCase().includes(searchLower) ||
        book.author?.toLowerCase().includes(searchLower) ||
        book.category?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(book => book.category === filters.category);
    }

    // Price range filter
    filtered = filtered.filter(book => 
      book.price >= filters.minPrice && book.price <= filters.maxPrice
    );

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(book => book.stock > 0);
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(book => (book.averageRating || 0) >= filters.rating);
    }

    // Sort books
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case 'price':
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case 'rating':
          aValue = a.averageRating || 0;
          bValue = b.averageRating || 0;
          break;
        case 'date':
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        case 'title':
        default:
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          break;
      }

      if (filters.sortOrder === 'desc') {
        return aValue < bValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    return filtered;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      category: '',
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      sortBy: 'title',
      sortOrder: 'asc',
      inStock: false,
      rating: 0
    });
  };

  return (
    <div className={`p-6 rounded-lg shadow-lg mb-8 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search Input */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Search Books</label>
          <input
            type="text"
            placeholder="Search by title, author, or category..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>

        {/* Category Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Sort By</label>
          <div className="flex gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="title">Title</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="date">Date Added</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="asc">↑ Asc</option>
              <option value="desc">↓ Desc</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Price Range */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">
            Price Range: ${filters.minPrice} - ${filters.maxPrice}
          </label>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Min Price</label>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Max Price</label>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Minimum Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                onClick={() => handleFilterChange('rating', filters.rating === rating ? 0 : rating)}
                className={`px-3 py-1 rounded-full transition ${
                  filters.rating >= rating
                    ? 'bg-yellow-500 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {rating}⭐
              </button>
            ))}
          </div>
        </div>

        {/* Additional Filters */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Other Filters</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                className="rounded focus:ring-indigo-500"
              />
              <span className="text-sm">In Stock Only</span>
            </label>
            <button
              onClick={clearFilters}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookFilter;