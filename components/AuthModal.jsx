import { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { name: name || email.split('@')[0], email };
    localStorage.setItem('786ai_user', JSON.stringify(userData));
    onLoginSuccess(userData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {isSignup ? 'Create 786 AI Account' : 'Login to 786 AI Hub'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl font-bold">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Ali Raza"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="mt-4">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">Or continue with</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          </div>

          <button
            type="button"
            onClick={() => {
              const googleUser = { name: 'Ali Raza', email: 'aliraza@gmail.com', provider: 'google' };
              localStorage.setItem('786ai_user', JSON.stringify(googleUser));
              onLoginSuccess(googleUser);
              onClose();
            }}
            className="w-full mt-2 flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-200 font-medium text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            onClick={() => setIsSignup(!isSignup)} 
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline ml-1"
          >
            {isSignup ? 'Login here' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
}
