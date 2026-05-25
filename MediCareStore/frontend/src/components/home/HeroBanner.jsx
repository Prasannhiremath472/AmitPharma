import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const slides = [
  {
    id: 1,
    title: 'Your Health, Our Priority',
    subtitle: 'Get genuine medicines delivered to your doorstep',
    description: 'Shop from 50,000+ authentic medicines with guaranteed quality and safety.',
    cta: 'Shop Now',
    ctaLink: '/products',
    badge: 'Free Delivery Over ₹499',
    bg: 'from-primary-900 via-primary-800 to-primary-700',
    accent: 'from-primary-400 to-cyan-400',
    emoji: '=�',
  },
  {
    id: 2,
    title: 'Vitamins & Supplements',
    subtitle: 'Boost your immunity with premium supplements',
    description: 'Authentic vitamins, protein supplements, and health boosters for you.',
    cta: 'Explore Now',
    ctaLink: '/products?category=vitamins',
    badge: 'Up to 30% Off',
    bg: 'from-emerald-900 via-emerald-800 to-teal-700',
    accent: 'from-emerald-400 to-teal-400',
    emoji: '<?',
  },
  {
    id: 3,
    title: 'Personal Care & Wellness',
    subtitle: 'Look good, feel great every day',
    description: 'Premium skincare, personal hygiene, and wellness products at best prices.',
    cta: 'Shop Wellness',
    ctaLink: '/products?category=personal-care',
    badge: 'New Arrivals',
    bg: 'from-purple-900 via-purple-800 to-indigo-800',
    accent: 'from-purple-400 to-pink-400',
    emoji: '✨',
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const prev = () => setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  const next = () => setCurrent(prev => (prev + 1) % slides.length);

  const slide = slides[current];

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br ${slide.bg} text-white min-h-[480px] md:min-h-[560px] flex items-center transition-all duration-700`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`inline-flex items-center gap-2 bg-gradient-to-r ${slide.accent} text-slate-900 text-xs font-bold px-4 py-2 rounded-full mb-4`}
              >
                🎯 {slide.badge}
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4 leading-tight">
                {slide.title}
              </h1>
              <h2 className={`text-xl md:text-2xl font-medium bg-gradient-to-r ${slide.accent} bg-clip-text text-transparent mb-4`}>
                {slide.subtitle}
              </h2>
              <p className="text-white/70 text-base md:text-lg mb-8 max-w-lg">
                {slide.description}
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
                <Link
                  to={slide.ctaLink}
                  className={`inline-flex items-center gap-2 bg-gradient-to-r ${slide.accent} text-slate-900 font-bold px-8 py-4 rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-200 text-lg`}
                >
                  {slide.cta}
                  <FiArrowRight />
                </Link>
                <Link
                  to="/categories"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium border-2 border-white/20 hover:border-white/40 px-6 py-4 rounded-2xl transition-all duration-200"
                >
                  Browse Categories
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-8 mt-10">
                {[
                  { value: '50K+', label: 'Products' },
                  { value: '2M+', label: 'Customers' },
                  { value: '100%', label: 'Genuine' },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/60 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Visual Element */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative">
                <div className="w-72 h-72 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <div className="w-52 h-52 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="text-9xl">{slide.emoji}</span>
                  </div>
                </div>
                {/* Floating badges */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -top-4 -right-4 bg-white text-slate-800 px-3 py-2 rounded-xl shadow-lg text-sm font-semibold"
                >
                  ⚡ Fast Delivery
                </motion.div>
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ repeat: Infinity, duration: 3.5 }}
                  className="absolute -bottom-4 -left-4 bg-emerald-400 text-emerald-900 px-3 py-2 rounded-xl shadow-lg text-sm font-semibold"
                >
                   100% Genuine
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
      >
        <FiChevronLeft className="text-xl" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
      >
        <FiChevronRight className="text-xl" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
