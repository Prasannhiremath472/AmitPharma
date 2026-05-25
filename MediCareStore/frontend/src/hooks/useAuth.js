import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser, logoutUser, registerUser, clearError } from '../redux/slices/authSlice';
import { clearCart } from '../redux/slices/cartSlice';
import { clearWishlist } from '../redux/slices/wishlistSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector(state => state.auth);

  const login = async (credentials) => {
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.name}! 👋`);
      if (result.payload.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      return { success: true };
    }
    const errorData = result.payload;
    if (errorData?.data?.requiresVerification) {
      navigate('/verify-otp', { state: { email: credentials.email } });
      return { success: false, requiresVerification: true };
    }
    toast.error(errorData?.message || 'Login failed');
    return { success: false };
  };

  const register = async (userData) => {
    const result = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Registration successful! Please verify your email.');
      navigate('/verify-otp', { state: { email: userData.email } });
      return { success: true };
    }
    toast.error(result.payload?.message || 'Registration failed');
    return { success: false };
  };

  const logout = async () => {
    await dispatch(logoutUser());
    dispatch(clearCart());
    dispatch(clearWishlist());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const clearAuthError = () => dispatch(clearError());

  const isAdmin = user?.role === 'admin';

  return {
    user,
    isAuthenticated,
    loading,
    error,
    isAdmin,
    login,
    register,
    logout,
    clearAuthError,
  };
};

export default useAuth;
