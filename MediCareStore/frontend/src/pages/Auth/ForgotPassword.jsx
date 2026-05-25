import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { MdLocalPharmacy } from 'react-icons/md';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('OTP sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiMail className="text-4xl text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 font-heading mb-3">Check Your Email</h2>
          <p className="text-slate-500 mb-6">We've sent an OTP to <strong>{email}</strong></p>
          <button
            onClick={() => navigate('/reset-password', { state: { email } })}
            className="btn-primary w-full py-3.5"
          >
            Enter OTP & Reset Password
          </button>
          <Link to="/login" className="block mt-4 text-sm text-slate-500 hover:text-primary-600">
            â† Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Forgot Password - Amit R. Medical</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center">
                <MdLocalPharmacy className="text-white text-2xl" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-slate-800 font-heading">Forgot Password?</h1>
            <p className="text-slate-500 mt-2">Enter your email and we'll send you an OTP to reset your password</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-field pl-10"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full py-3.5"
              >
                {loading ? 'Sending OTP...' : 'Send Reset OTP'}
              </motion.button>
            </form>

            <Link to="/login" className="flex items-center justify-center gap-2 mt-5 text-sm text-slate-500 hover:text-primary-600 font-medium">
              <FiArrowLeft /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;

