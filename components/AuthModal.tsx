
import React from 'react';

interface AuthModalProps {
  onAuthSuccess: () => void;
}

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.021,35.596,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const AuthModal: React.FC<AuthModalProps> = ({ onAuthSuccess }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold mb-4">You're ready to build</h2>
        <p className="text-gray-400 mb-8">
          Create a free account to save your progress and access the full validation toolkit.
        </p>
        <button
          onClick={onAuthSuccess}
          className="w-full bg-white text-gray-800 font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-200"
        >
          <GoogleIcon />
          Sign up with Google
        </button>
        <p className="text-xs text-gray-500 mt-4">
            For demonstration, clicking this button will proceed without actual authentication.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
