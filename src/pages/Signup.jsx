import { SignUp } from "@clerk/clerk-react";

const Signup = ({ darkMode }) => {
  return (
    <div className={`flex justify-center items-center min-h-[80vh] transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`w-full max-w-md ${
        darkMode ? 'bg-gray-800 rounded-lg p-8 shadow-xl' : ''
      }`}>
        <SignUp 
          redirectUrl="/" 
          appearance={{
            elements: {
              rootBox: darkMode ? 'shadow-xl' : '',
              card: darkMode 
                ? 'bg-gray-800 border border-gray-700 shadow-xl' 
                : 'bg-white',
              headerTitle: darkMode ? 'text-white' : 'text-gray-900',
              headerSubtitle: darkMode ? 'text-gray-300' : 'text-gray-600',
              formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700',
              formFieldInput: darkMode 
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900',
              formFieldLabel: darkMode ? 'text-gray-300' : 'text-gray-700',
              identityPreviewText: darkMode ? 'text-gray-300' : 'text-gray-600',
              formFieldInputShowPasswordButton: darkMode ? 'text-gray-400' : 'text-gray-500'
            }
          }}
        />
      </div>
    </div>
  );
};

export default Signup;
