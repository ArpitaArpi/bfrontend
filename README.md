# BookBazar - Online Book Marketplace

BookBazar is a modern, responsive online bookstore built with React, Vite, and TailwindCSS. It provides a complete shopping experience for book lovers with features like browsing, purchasing, order tracking, and admin management.

## 📚 Features

### Customer Features

- **User Authentication**: Secure login/signup using Clerk Authentication
- **Book Browsing**: Explore books with advanced filtering and search capabilities
- **Book Details**: View comprehensive information about each book including reviews
- **Shopping Cart**: Add/remove books and adjust quantities
- **Wishlist**: Save favorite books for later purchase
- **Checkout Process**: Secure checkout with coupon support
- **Order History**: Track past orders and their status
- **Reviews System**: Read and write book reviews
- **Responsive Design**: Mobile-friendly interface with dark mode support

### Admin Features

- **Dashboard**: Overview of key metrics and recent activity
- **Book Management**: Add, edit, and remove books from the catalog
- **User Management**: View and manage customer accounts
- **Order Management**: Process and track customer orders
- **Review Moderation**: Approve or delete user reviews

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern UI library
- **Vite 7** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **DaisyUI** - TailwindCSS component library
- **React Router** - Declarative routing
- **Redux Toolkit** - State management
- **Clerk** - Authentication
- **React Icons** - Icon library
- **React Toastify** - Notification system

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB instance

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/bookbazar.git
cd bookbazar/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:5001
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Previewing Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── pages/              # Page-level components
├── services/           # API service files
├── store/              # Redux store and slices
├── utils/              # Utility functions
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
```

## 🎨 UI/UX Features

- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on all device sizes
- **Interactive Elements**: Hover effects and smooth transitions
- **Toast Notifications**: User feedback for actions
- **Loading States**: Skeleton loaders and spinners
- **Form Validation**: Client-side validation for forms

## 🔐 Authentication

BookBazar uses Clerk for authentication, providing:

- Email/Password authentication
- Social login (Google, Facebook, etc.)
- User session management
- Role-based access control (RBAC)

## 🛒 Shopping Experience

1. **Browse Books**: Explore the catalog with filtering options
2. **View Details**: See book information, reviews, and ratings
3. **Add to Cart**: Add books to your shopping cart
4. **Save for Later**: Add books to your wishlist
5. **Checkout**: Secure checkout process with coupon support
6. **Order Tracking**: View order history and status

## 📊 Admin Dashboard

Admins can access the dashboard at `/admin/dashboard` to manage:

- Books (add, edit, delete)
- Users (view, manage)
- Orders (process, track)
- Reviews (moderate)

## 🧪 Testing

Currently, the project does not have a testing framework configured. To add testing capabilities:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

## 📦 Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy!

### Netlify

1. Link your repository to Netlify
2. Set build command to `npm run build`
3. Set publish directory to `dist`
4. Add environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Clerk](https://clerk.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [DaisyUI](https://daisyui.com/)

## 📞 Support

For support, email support@bookbazar.com or open an issue in the repository.
