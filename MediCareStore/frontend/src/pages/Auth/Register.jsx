import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import Logo from '../../components/common/Logo';

const RegisterPage = () => {
  return (
    <>
      <Helmet>
        <title>Create Account - Amit R. Medical</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <Link to="/">
              <Logo size="lg" showTagline />
            </Link>
            <h1 className="text-2xl font-bold text-slate-800 mt-6 font-heading">Create Account</h1>
            <p className="text-slate-500 mt-1.5">Join millions of satisfied customers</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <RegisterForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
