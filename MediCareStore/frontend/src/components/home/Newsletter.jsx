import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success('<‰ Subscribed! Check your email for a special offer.');
      setEmail('');
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiMail className="text-white text-3xl" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-heading mb-3">
            Stay Healthy, Stay Informed
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            Subscribe to get health tips, exclusive offers, and 10% off your next order!
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-5 py-4 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm font-medium"
            />
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-70"
            >
              {loading ? 'Subscribing...' : (<>Subscribe <FiArrowRight /></>)}
            </motion.button>
          </form>

          <p className="text-primary-200 text-xs mt-4">
            No spam, ever. Unsubscribe at any time. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
