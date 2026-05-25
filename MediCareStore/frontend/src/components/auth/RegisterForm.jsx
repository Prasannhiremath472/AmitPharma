import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';

const RegisterForm = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();

  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = 'Name is required';
    else if (form.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit Indian phone number';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    const { confirmPassword, ...data } = form;
    await register(data);
  };

  const Field = ({ name, label, type = 'text', icon: Icon, placeholder, extra }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type={type}
          value={form[name]}
          onChange={(e) => setForm(prev => ({ ...prev, [name]: e.target.value }))}
          placeholder={placeholder}
          className={`input-field pl-10 ${extra || ''} ${errors[name] ? 'border-red-400' : ''}`}
        />
        {name === 'password' || name === 'confirmPassword' ? (
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        ) : null}
      </div>
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Field name="name" label="Full Name" icon={FiUser} placeholder="John Doe" />
      <Field name="email" label="Email Address" type="email" icon={FiMail} placeholder="you@example.com" />
      <Field name="phone" label="Phone Number (Optional)" type="tel" icon={FiPhone} placeholder="10-digit mobile number" />
      <Field name="password" label="Password" type={showPassword ? 'text' : 'password'} icon={FiLock} placeholder="Min. 6 characters" />
      <Field name="confirmPassword" label="Confirm Password" type={showPassword ? 'text' : 'password'} icon={FiLock} placeholder="Re-enter your password" />

      <p className="text-xs text-slate-500">
        By creating an account, you agree to our{' '}
        <Link to="#" className="text-primary-600 hover:underline">Terms of Service</Link> and{' '}
        <Link to="#" className="text-primary-600 hover:underline">Privacy Policy</Link>
      </p>

      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.98 }}
        className="btn-primary w-full py-3.5 text-base"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creating account...
          </span>
        ) : 'Create Account'}
      </motion.button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign In</Link>
      </p>
    </motion.form>
  );
};

export default RegisterForm;
