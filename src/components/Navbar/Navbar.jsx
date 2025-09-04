import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { FaBars, FaChevronDown, FaCog, FaHeart, FaMoon, FaSearch, FaShoppingCart, FaSun } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { selectWishlistCount } from "../../store/wishlistSlice";
import { useIsAdmin } from "../../utils/auth";

const links = [
  { title: "Home", link: "/" },
  { title: "All Books", link: "/all-books" },
  { title: "About", link: "/about" },
];

const Navbar = ({ darkMode, setDarkMode }) => {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAdmin } = useIsAdmin();
  const { itemCount } = useSelector((state) => state.cart);
  const wishlistCount = useSelector(selectWishlistCount);
  const navigate = useNavigate();

  // Timeout refs for smoother hover behavior
  const [timeouts, setTimeouts] = useState({});

  const handleMouseEnter = (menu) => {
    if (timeouts[menu]) {
      clearTimeout(timeouts[menu]);
    }
    switch(menu) {
      case 'admin':
        setAdminMenuOpen(true);
        break;
      case 'mega':
        setMegaOpen(true);
        break;
      case 'user':
        setUserMenuOpen(true);
        break;
    }
  };

  const handleMouseLeave = (menu) => {
    const timeout = setTimeout(() => {
      switch(menu) {
        case 'admin':
          setAdminMenuOpen(false);
          break;
        case 'mega':
          setMegaOpen(false);
          break;
        case 'user':
          setUserMenuOpen(false);
          break;
      }
    }, 150); // Small delay to prevent flickering
    
    setTimeouts(prev => ({ ...prev, [menu]: timeout }));
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeouts).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [timeouts]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/all-books?search=${encodeURIComponent(search)}`);
      setSearch("");
      setMenuOpen(false);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold tracking-wide"
          >
            <span className="bg-yellow-300 text-indigo-700 px-2 py-1 rounded-lg shadow-md">
              📚
            </span>
            BookBazar
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-8 ml-6">
            <ul className="flex gap-8 items-center">
              {links.map((item) => (
                <li key={item.link}>
                  <Link
                    className="hover:text-yellow-300 transition font-medium"
                    to={item.link}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}

              {/* Admin Menu */}
              <SignedIn>
                {isAdmin && (
                  <li
                    className="relative"
                    onMouseEnter={() => handleMouseEnter('admin')}
                    onMouseLeave={() => handleMouseLeave('admin')}
                  >
                    <button className="hover:text-yellow-300 transition font-medium flex items-center gap-1">
                      <FaCog /> Admin <FaChevronDown className="text-xs" />
                    </button>

                    {adminMenuOpen && (
                      <div className="absolute left-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-md text-black shadow-2xl rounded-lg p-4 border border-gray-200 z-50">
                        <ul className="space-y-2">
                          <li>
                            <Link
                              to="/admin/dashboard"
                              className="block px-3 py-2 hover:bg-indigo-50 rounded transition text-sm"
                              onClick={() => setAdminMenuOpen(false)}
                            >
                              Dashboard
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/admin/books"
                              className="block px-3 py-2 hover:bg-indigo-50 rounded transition text-sm"
                              onClick={() => setAdminMenuOpen(false)}
                            >
                              Manage Books
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/admin/users"
                              className="block px-3 py-2 hover:bg-indigo-50 rounded transition text-sm"
                              onClick={() => setAdminMenuOpen(false)}
                            >
                              Manage Users
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/admin/orders"
                              className="block px-3 py-2 hover:bg-indigo-50 rounded transition text-sm"
                              onClick={() => setAdminMenuOpen(false)}
                            >
                              Manage Orders
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/admin/reviews"
                              className="block px-3 py-2 hover:bg-indigo-50 rounded transition text-sm"
                              onClick={() => setAdminMenuOpen(false)}
                            >
                              Manage Reviews
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                )}
              </SignedIn>

              {/* Mega Menu */}
              <li
                className="relative"
                onMouseEnter={() => handleMouseEnter('mega')}
                onMouseLeave={() => handleMouseLeave('mega')}
              >
                <button className="hover:text-yellow-300 transition font-medium flex items-center gap-1">
                  Categories <FaChevronDown className="text-xs" />
                </button>

                {megaOpen && (
                  <div className="absolute left-0 top-full mt-2 w-[650px] bg-white/95 backdrop-blur-md text-black shadow-2xl rounded-2xl p-6 grid grid-cols-3 gap-6 border border-gray-200 z-50">
                    <div>
                      <h4 className="font-bold mb-3 text-indigo-600">Fiction</h4>
                      <ul className="space-y-2">
                        <li><Link to="/category/romance" className="hover:text-indigo-600 transition">Romance</Link></li>
                        <li><Link to="/category/mystery" className="hover:text-indigo-600 transition">Mystery</Link></li>
                        <li><Link to="/category/fantasy" className="hover:text-indigo-600 transition">Fantasy</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-3 text-indigo-600">Non-Fiction</h4>
                      <ul className="space-y-2">
                        <li><Link to="/category/self-help" className="hover:text-indigo-600 transition">Self-Help</Link></li>
                        <li><Link to="/category/business" className="hover:text-indigo-600 transition">Business</Link></li>
                        <li><Link to="/category/history" className="hover:text-indigo-600 transition">History</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-3 text-indigo-600">Kids</h4>
                      <ul className="space-y-2">
                        <li><Link to="/category/comics" className="hover:text-indigo-600 transition">Comics</Link></li>
                        <li><Link to="/category/educational" className="hover:text-indigo-600 transition">Educational</Link></li>
                        <li><Link to="/category/fairy-tales" className="hover:text-indigo-600 transition">Fairy Tales</Link></li>
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search */}
            <form
              onSubmit={handleSearch}
              className={`flex items-center rounded-full overflow-hidden shadow-md transition-colors duration-300 ${
                darkMode ? 'bg-gray-700' : 'bg-white'
              }`}
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`px-4 py-2 w-56 md:w-72 outline-none transition-colors duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white text-black placeholder-gray-500'
                }`}
                placeholder="Search books..."
              />
              <button
                type="submit"
                className="bg-yellow-300 text-black px-4 py-2 hover:brightness-110"
              >
                <FaSearch />
              </button>
            </form>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-xl p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
            >
              <FaShoppingCart className="text-xl" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
            >
              <FaHeart className="text-xl" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Show login/signup when logged out */}
            <SignedOut>
              <Link
                to="/login"
                className="px-4 py-2 border border-white rounded-full hover:bg-yellow-300 hover:text-black transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-yellow-300 text-black rounded-full hover:brightness-110 transition font-medium"
              >
                Sign Up
              </Link>
            </SignedOut>

            {/* Show user profile when logged in */}
            <SignedIn>
              {/* User Menu Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('user')}
                onMouseLeave={() => handleMouseLeave('user')}
              >
                <button className="px-3 py-2 bg-white/20 rounded-full hover:bg-white/30 transition font-medium text-sm">
                  My Account
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-md text-black shadow-2xl rounded-lg p-4 border border-gray-200 z-50">
                    <ul className="space-y-2">
                      <li>
                        <Link
                          to="/orders"
                          className="block px-3 py-2 hover:bg-indigo-50 rounded transition text-sm"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          📦 My Orders
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/wishlist"
                          className="block px-3 py-2 hover:bg-indigo-50 rounded transition text-sm"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          ❤️ My Wishlist
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/cart"
                          className="block px-3 py-2 hover:bg-indigo-50 rounded transition text-sm"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          🛒 My Cart
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 bg-white/20 rounded-full"
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-gradient-to-r from-indigo-600 to-purple-700 p-6 space-y-6 shadow-lg">
          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white rounded-full overflow-hidden"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 flex-1 text-black outline-none"
              placeholder="Search books..."
            />
            <button
              type="submit"
              className="bg-yellow-300 text-black px-4 py-2 hover:brightness-110"
            >
              <FaSearch />
            </button>
          </form>

            {/* Mobile Links */}
            <ul className="flex flex-col gap-4 text-lg font-medium">
              {links.map((item) => (
                <li key={item.link}>
                  <Link
                    to={item.link}
                    className="hover:text-yellow-300 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              
              {/* Mobile Admin Menu */}
              <SignedIn>
                {isAdmin && (
                  <li>
                    <details>
                      <summary className="cursor-pointer flex items-center gap-2">
                        <FaCog /> Admin
                      </summary>
                      <ul className="pl-4 mt-2 space-y-2">
                        <li>
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setMenuOpen(false)}
                            className="block py-1 hover:text-yellow-300 transition"
                          >
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/admin/books"
                            onClick={() => setMenuOpen(false)}
                            className="block py-1 hover:text-yellow-300 transition"
                          >
                            Manage Books
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/admin/users"
                            onClick={() => setMenuOpen(false)}
                            className="block py-1 hover:text-yellow-300 transition"
                          >
                            Manage Users
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/admin/orders"
                            onClick={() => setMenuOpen(false)}
                            className="block py-1 hover:text-yellow-300 transition"
                          >
                            Manage Orders
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/admin/reviews"
                            onClick={() => setMenuOpen(false)}
                            className="block py-1 hover:text-yellow-300 transition"
                          >
                            Manage Reviews
                          </Link>
                        </li>
                      </ul>
                    </details>
                  </li>
                )}
              </SignedIn>
              
              <li>
              <details>
                <summary className="cursor-pointer">Categories</summary>
                <ul className="pl-4 mt-2 space-y-2">
                  <li><Link to="/category/romance">Romance</Link></li>
                  <li><Link to="/category/mystery">Mystery</Link></li>
                  <li><Link to="/category/fantasy">Fantasy</Link></li>
                  <li><Link to="/category/self-help">Self-Help</Link></li>
                  <li><Link to="/category/business">Business</Link></li>
                </ul>
              </details>
            </li>
          </ul>

          {/* Mobile Actions */}
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-xl p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* Mobile Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
              onClick={() => setMenuOpen(false)}
            >
              <FaShoppingCart className="text-xl" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
              onClick={() => setMenuOpen(false)}
            >
              <FaHeart className="text-xl" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* If logged out → show login/signup */}
            <SignedOut>
              <Link
                to="/login"
                className="px-4 py-2 border border-white rounded-full hover:bg-yellow-300 hover:text-black flex-1 text-center"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-yellow-300 text-black rounded-full hover:brightness-110 flex-1 text-center"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </SignedOut>

            {/* If logged in → show Clerk UserButton */}
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
