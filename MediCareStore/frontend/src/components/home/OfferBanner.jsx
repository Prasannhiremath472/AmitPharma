import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const OfferBanner = () => {
  const offers = [
    {
      title: 'First Order Special',
      discount: '20% OFF',
      code: 'FIRST20',
      description: 'Get 20% off on your first order. No minimum purchase required!',
      bg: 'from-primary-600 to-primary-800',
      emoji: '<‰',
    },
    {
      title: 'Vitamins & Health',
      discount: 'Up to 40% OFF',
      code: 'HEALTH40',
      description: 'Massive savings on all vitamin and supplement products.',
      bg: 'from-emerald-600 to-teal-700',
      emoji: '=ª',
    },
    {
      title: 'Senior Care',
      discount: '15% OFF',
      code: 'SENIOR15',
      description: 'Special discount for senior citizens on all medicines.',
      bg: 'from-purple-600 to-indigo-700',
      emoji: 'â¤ï¸',
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-br ${offer.bg} text-white rounded-2xl p-6 relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 text-8xl opacity-20 -translate-y-2 translate-x-2">
                {offer.emoji}
              </div>
              <div className="relative">
                <div className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">{offer.title}</div>
                <div className="text-4xl font-black mb-2">{offer.discount}</div>
                <p className="text-sm text-white/80 mb-4">{offer.description}</p>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1.5 rounded-lg">
                    <span className="font-mono font-bold text-sm">{offer.code}</span>
                  </div>
                  <Link
                    to="/products"
                    className="text-sm font-semibold hover:underline"
                  >
                    Shop Now â†’
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferBanner;
