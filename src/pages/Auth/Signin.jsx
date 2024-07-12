import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';
import { baseurl } from '../../baseurl/baseurl';
import { setUser } from '../../userSlice'; // Adjust the import path as necessary

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseurl}/api/auth/login`, {
        email,
        password,
      });

      // Set cookie with token, expires in 1 day
      Cookies.set('token', response.data.token, { expires: 1 });
      const userRole = response.data.role;
      const userName = response.data.username;
      const userID = response.data.userId;

      // Dispatch the setUser action
      dispatch(setUser({ id: userID, role: userRole, name: userName }));

      console.log('User role:', userRole, 'User name:', userName, 'User id:', userID);

      // Redirect based on role
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setErrorMessage('User not found');
        } else if (error.response.status === 401) {
          setErrorMessage('Wrong password');
        } else {
          setErrorMessage('Error signing in');
        }
      } else {
        setErrorMessage('Error signing in');
      }
      console.error('Error signing in', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSignIn} className="w-1/3 bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl mb-6">Sign In</h2>
        {errorMessage && <p className="mb-4 text-red-500">{errorMessage}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Sign In
        </button>
      </form>
    </div>
  );
}
