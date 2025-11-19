import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';   // ⬅️ USE API.JS (VERY IMPORTANT)

const PatientAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/patient-dashboard';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // LOGIN
        const response = await API.post('/auth/login', {   // ⬅️ FIXED
          email: formData.email,
          password: formData.password
        });

        if (response.success) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userData', JSON.stringify(response.user));
          navigate('/doctors');
        } else {
          setError(response.message || 'Invalid login');
        }

      } else {
        // SIGN UP
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const response = await API.post('/auth/register', {   // ⬅️ FIXED
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address
        });

        if (response.success) {
          alert('Signup successful! Please login.');
          setIsLogin(true);
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            address: ''
          });
        } else {
          setError(response.message || 'Signup failed');
        }
      }

    } catch (error) {
      console.error('API Error:', error);
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">

        <div className="text-center">
          <button
            onClick={() => navigate('/role-selection')}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back
          </button>

          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Patient Login' : 'Patient Sign Up'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {error && (
            <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded">
              {error}
            </div>
          )}

          {!isLogin && (
            <input
              type="text"
              required
              value={formData.name}
              placeholder="Full Name"
              className="w-full p-3 border rounded"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          )}

          <input
            type="email"
            required
            value={formData.email}
            placeholder="Email"
            className="w-full p-3 border rounded"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <input
            type="password"
            required
            value={formData.password}
            placeholder="Password"
            className="w-full p-3 border rounded"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          {!isLogin && (
            <>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                placeholder="Confirm Password"
                className="w-full p-3 border rounded"
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-3 border rounded"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <input
                type="text"
                placeholder="Address"
                className="w-full p-3 border rounded"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 hover:text-blue-800 text-center block w-full mt-4"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </button>

      </div>
    </div>
  );
};

export default PatientAuth;
