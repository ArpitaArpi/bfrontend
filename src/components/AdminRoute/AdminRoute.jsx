import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { useIsAdmin } from '../../utils/auth';

const AdminRoute = ({ children, darkMode }) => {
  const { isAdmin, loading } = useIsAdmin();

  // Show loading while checking admin status
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        {isAdmin ? (
          children
        ) : (
          <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
            darkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <div className={`max-w-md mx-auto text-center p-8 rounded-lg shadow-lg transition-colors duration-300 ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}>
              <div className="text-6xl mb-4">🚫</div>
              <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                You don't have administrator privileges to access this page.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => window.history.back()}
                  className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                >
                  Go Back
                </button>
                <a
                  href="/"
                  className="block w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                >
                  Return to Home
                </a>
              </div>
            </div>
          </div>
        )}
      </SignedIn>
      
      {/* If user is not signed in, redirect to sign in page */}
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default AdminRoute;