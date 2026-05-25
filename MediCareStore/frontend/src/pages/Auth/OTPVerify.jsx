import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { MdLocalPharmacy } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import OTPVerification from '../../components/auth/OTPVerification';
import { loadUser } from '../../redux/slices/authSlice';
import { fetchCart as fetchCartAction } from '../../redux/slices/cartSlice';

const OTPVerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = location.state?.email || '';

  if (!email) {
    navigate('/register');
    return null;
  }

  const handleSuccess = async (data) => {
    if (data?.token) {
      await dispatch(loadUser());
      dispatch(fetchCartAction());
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <Helmet>
        <title>Verify OTP - Amit R. Medical</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
                <MdLocalPharmacy className="text-white text-2xl" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-slate-800 mt-6 font-heading">Verify Your Email</h1>
            <p className="text-slate-500 mt-1.5">We've sent a code to your email</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <OTPVerification
              email={email}
              purpose="verification"
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OTPVerifyPage;

