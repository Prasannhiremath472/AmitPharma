import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SEOContent = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="py-10 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Your One-Stop Online Pharmacy
          </h2>

          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>
              Amit R. Medical is your trusted online pharmacy for genuine medicines, vitamins, supplements, and healthcare products. We offer a wide range of OTC and prescription medicines, personal care products, and wellness essentials  all at the best prices with fast delivery to your doorstep.
            </p>
            <p>
              With a network of licensed pharmacists and trusted suppliers, every product you order from Amit R. Medical is 100% genuine, properly stored, and delivered safely. We serve customers across 19,000+ pin codes all over India.
            </p>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <p>
                    Our product catalogue includes 50,000+ medicines across categories like vitamins & supplements, skin care, hair care, baby care, ayurvedic products, fitness nutrition, sexual wellness, diabetes care devices, and personal hygiene  making us the most complete online pharmacy in India.
                  </p>
                  <p>
                    Amit R. Medical PLUS membership gives you an additional 5% savings on every order, priority customer support, and exclusive member-only deals. Join over 51 million registered users who trust us for their daily healthcare needs.
                  </p>
                  <p>
                    We deliver to 19,000+ pin codes across India and have fulfilled over 71 million orders. Free delivery on all orders above ₹299. Our dedicated logistics network ensures your products reach you on time, every time.
                  </p>
                  <p>
                    Looking for generic alternatives that save you money without compromising on quality? Our branded substitute service helps you find FDA-approved generic equivalents at a fraction of the cost, saving up to 50% on your medicine bills.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 text-primary-600 text-sm font-semibold hover:underline flex items-center gap-1"
          >
            {expanded ? 'Read Less ↑' : 'Read More ↓'}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default SEOContent;
