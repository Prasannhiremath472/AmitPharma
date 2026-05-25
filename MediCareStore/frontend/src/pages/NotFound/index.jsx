import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiHome, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Amit R. Medical</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          {/* 404 Visual */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="text-9xl mb-6 select-none"
          >
            ðŸŠ
          </motion.div>

          <h1 className="text-6xl font-black text-primary-600 font-heading mb-2">404</h1>
          <h2 className="text-2xl font-bold text-slate-800 mb-3 font-heading">Page Not Found</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Oops! The page you're looking for seems to have gone missing. Let's get you back to shopping for your health needs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <FiHome /> Go to Home
            </Link>
            <Link
              to="/products"
              className="flex items-center gap-2 border-2 border-primary-200 text-primary-600 hover:border-primary-400 font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <FiShoppingBag /> Browse Products
            </Link>
          </div>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-medium mx-auto mt-6 text-sm"
          >
            <FiArrowLeft /> Go Back
          </button>
        </motion.div>
      </div>
    </>
  );
};

export default NotFoundPage;

