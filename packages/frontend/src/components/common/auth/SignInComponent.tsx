import { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import Image from 'next/image';
import bgImage from '@/assets/bg-1.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const SignInComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setLoginStatus } = useAuthContext();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        toast.error(errorData.message);
      }

      const data = await response.json();
      const user = data.data;

      if (user.isLogin) {
        setLoginStatus(true, user); // Set login status and user data
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="left-bg">
      <Image src={bgImage} alt="bg image" />
      <div className="bg-header">
        <h1 className="heading">SSG Task Management</h1>
      </div>
      <div className="signin-wrapper h-screen bg-gradient-to-br flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            {' '}
            <FontAwesomeIcon icon="user" /> Sign In
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="submit"
              disabled={!username || !password}
              className={`w-full py-3 font-semibold rounded-lg shadow-md transition duration-200 ease-in-out ${
                !username || !password
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-500 text-white'
              }`}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
