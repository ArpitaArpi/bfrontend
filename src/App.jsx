import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useInitializeUserData } from "./hooks/useBackendSync";

import AdminRoute from "./components/AdminRoute/AdminRoute";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import AllBooks from "./pages/AllBooks";
import BookDetails from "./pages/BookDetails";
import BookManagement from "./pages/BookManagement";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OrderHistory from "./pages/OrderHistory";
import OrderManagement from "./pages/OrderManagement";
import Order from "./pages/OrderPage";
import ReviewManagement from "./pages/ReviewManagement";
import Signup from "./pages/Signup";
import UserManagement from "./pages/UserManagement";
import WishlistPage from "./pages/WishlistPage";

const App = () => {
  // Initialize dark mode from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  // Initialize user data (cart, wishlist) when user logs in
  useInitializeUserData();

  // Save dark mode preference to localStorage and apply to DOM
  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* Navbar */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Page Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} />} />
          <Route path="/about" element={<About darkMode={darkMode} />} />
          <Route path="/all-books" element={<AllBooks darkMode={darkMode} />} />
          <Route path="/books/:id" element={<BookDetails darkMode={darkMode} />} />
          <Route path="/login" element={<Login darkMode={darkMode} />} />
          <Route path="/signup" element={<Signup darkMode={darkMode} />} />
          <Route path="/cart" element={<CartPage darkMode={darkMode} />} />
          <Route path="/wishlist" element={<WishlistPage darkMode={darkMode} />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute darkMode={darkMode}>
                <AdminDashboard darkMode={darkMode} />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/books"
            element={
              <AdminRoute darkMode={darkMode}>
                <BookManagement darkMode={darkMode} />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute darkMode={darkMode}>
                <UserManagement darkMode={darkMode} />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute darkMode={darkMode}>
                <OrderManagement darkMode={darkMode} />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <AdminRoute darkMode={darkMode}>
                <ReviewManagement darkMode={darkMode} />
              </AdminRoute>
            }
          />

          {/* Protected User Routes */}
          <Route
            path="/orders"
            element={
              <SignedIn>
                <OrderHistory darkMode={darkMode} />
              </SignedIn>
            }
          />
          <Route
            path="/order/:id"
            element={
              <SignedIn>
                <Order darkMode={darkMode} />
              </SignedIn>
            }
          />
          <Route
            path="/checkout"
            element={
              <SignedIn>
                <Checkout darkMode={darkMode} />
              </SignedIn>
            }
          />
          <Route
            path="/protected"
            element={
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default App;
