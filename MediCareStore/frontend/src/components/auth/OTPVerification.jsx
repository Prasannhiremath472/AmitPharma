import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const OTPVerification = ({ email, purpose = 'verification', onSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = pasted.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp: otpValue, purpose });
      toast.success('OTP verified successfully!');
      if (res.data.data?.token) {
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('refreshToken', res.data.data.refreshToken);
      }
      onSuccess && onSuccess(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await api.post('/auth/resend-otp', { email, purpose });
      toast.success('OTP resent to your email');
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      toast.error('Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-sm text-slate-500 text-center mb-6">
        We sent a 6-digit OTP to{' '}
        <span className="font-semibold text-slate-800">{email}</span>
      </p>

      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-center gap-2 mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputs.current[index] = el}
              type="text"
              inputMode="numeric"
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              maxLength={1}
              className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all
                ${digit ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 focus:border-primary-400 bg-slate-50'}
              `}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <motion.button
          type="submit"
          disabled={loading || otp.join('').length !== 6}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full py-3.5 mb-4"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verifying...
            </span>
          ) : 'Verify OTP'}
        </motion.button>
      </form>

      <div className="text-center">
        {canResend ? (
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
          >
            {resendLoading ? 'Resending...' : '🔄 Resend OTP'}
          </button>
        ) : (
          <p className="text-sm text-slate-400">
            Resend OTP in{' '}
            <span className="font-semibold text-slate-600">{countdown}s</span>
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default OTPVerification;
