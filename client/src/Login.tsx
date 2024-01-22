import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Authcontext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const history = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://curvecracker-c4e9470535d7.herokuapp.com/api/user/login', {
        email,
        password
      });
      setIsLoggedIn(true);
      localStorage.setItem('studentId', studentId);
      localStorage.setItem('studentEmail', email);
      history('/dashboard');
    } catch (error: any) {
      setError('Invalid credentials');
    }
  };

  const navigateToRegister = () => {
    history('/register'); 
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleLogin} className="max-w-sm mx-auto">
        <div className="mb-4">
          <label htmlFor="id" className="block text-gray-700 text-sm font-bold mb-2">Student ID</label>
          <input type="id" id="id" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>

        {error && <p className="text-red-500 text-xs italic">{error}</p>}

        <div className="flex items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Sign In
          </button>
          <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={navigateToRegister}>
          Register
        </button>
        </div>
      </form>
    </div>
  );
};

export default Login;