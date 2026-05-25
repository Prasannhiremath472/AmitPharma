import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import Logo from '../../components/common/Logo';

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Login - Amit R. Medical</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Link to="/">
              <Logo size="lg" showTagline />
            </Link>
            <h1 className="text-2xl font-bold text-slate-800 mt-6 font-heading">Welcome Back!</h1>
            <p className="text-slate-500 mt-1.5">Sign in to your account to continue</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <LoginForm />
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Protected by industry-standard encryption =
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
