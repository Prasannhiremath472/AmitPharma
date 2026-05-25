import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiArrowRight, FiShoppingCart } from 'react-icons/fi';

const SLIDES = [
  {
    id: 1,
    tag: 'MEDICINES',
    title: 'Get Genuine',
    highlight: 'Medicines Online',
    sub: 'Save up to 27% on all prescription & OTC medicines. 100% genuine, delivered fast to your doorstep.',
    cta: 'Shop Medicines',
    ctaLink: '/products',
    badge: '27% OFF',
    badgeColor: '#65a30d',
    accentColor: '#bef264',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1600&h=900&fit=crop&auto=format&q=80',
    overlayFrom: 'rgba(10,26,5,0.88)',
    overlayTo: 'rgba(30,60,10,0.60)',
    stats: [
      { icon: '=�', label: '50K+ Medicines' },
      { icon: '=�', label: '2-Hr Delivery' },
      { icon: '', label: '100% Genuine' },
    ],
  },
  {
    id: 2,
    tag: 'VITAMINS & SUPPLEMENTS',
    title: 'Boost Your',
    highlight: 'Health & Immunity',
    sub: 'Top-quality vitamins, supplements & nutrition products. Trusted brands at the best prices.',
    cta: 'Shop Now',
    ctaLink: '/products',
    badge: 'UP TO 40% OFF',
    badgeColor: '#65a30d',
    accentColor: '#d9f99d',
    img: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1600&h=900&fit=crop&auto=format&q=80',
    overlayFrom: 'rgba(5,20,5,0.88)',
    overlayTo: 'rgba(20,50,10,0.60)',
    stats: [
      { icon: '<?', label: '5K+ Supplements' },
      { icon: '<�', label: 'Best Prices' },
      { icon: '=�', label: 'Fast Dispatch' },
    ],
  },
  {
    id: 3,
    tag: 'PERSONAL CARE',
    title: 'Premium Care',
    highlight: 'Products for You',
    sub: 'Skin care, hair care, baby care & wellness essentials  everything for your family in one place.',
    cta: 'Explore Products',
    ctaLink: '/products',
    badge: 'UP TO 60% OFF',
    badgeColor: '#65a30d',
    accentColor: '#bef264',
    img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1600&h=900&fit=crop&auto=format&q=80',
    overlayFrom: 'rgba(8,22,5,0.88)',
    overlayTo: 'rgba(25,55,10,0.60)',
    stats: [
      { icon: '>�', label: 'Skin & Hair Care' },
      { icon: '=v', label: 'Baby Products' },
      { icon: '💆', label: 'Wellness Essentials' },
    ],
  },
];

const PharmHero = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setDirection(1);
      setActive(a => (a + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(t);
  }, []);

  const goTo = (i) => {
    setDirection(i > active ? 1 : -1);
    setActive(i);
  };

  const slide = SLIDES[active];

  return (
    <section
      className="relative overflow-hidden text-white flex flex-col"
      style={{ minHeight: 'calc(100vh - 92px)', height: 'calc(100vh - 92px)' }}
    >
      {/* ── Background image layer ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${slide.id}`}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0 z-0"
        >
          <img src={slide.img} alt="" className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(105deg, ${slide.overlayFrom} 0%, ${slide.overlayTo} 55%, rgba(0,0,0,0.25) 100%)`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Announcement bar ── */}
      <div className="relative z-10 bg-black/40 backdrop-blur-sm text-xs text-center py-2 px-4 text-white/80 font-medium tracking-wide border-b border-white/10">
        <� FREE delivery above ₹299 &nbsp;·&nbsp; Use{' '}
        <span className="text-yellow-300 font-bold">FIRST20</span> for 20% off your first order &nbsp;·&nbsp;
        =� Shop genuine medicines &amp; healthcare products
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex items-center py-10">
        <div className="grid md:grid-cols-2 gap-12 items-center w-full">

          {/* Left  text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${slide.id}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white/90 text-xs font-bold px-3 py-1.5 rounded-full mb-5 tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {slide.tag}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.08] mb-4 tracking-tight drop-shadow-md">
                {slide.title}
                <br />
                <span style={{ color: slide.accentColor }}>{slide.highlight}</span>
              </h1>

              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-md">
                {slide.sub}
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  to={slide.ctaLink}
                  className="group inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-7 py-3.5 rounded-2xl text-sm hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95"
                >
                  {slide.cta}
                  <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3.5 rounded-2xl text-sm border border-white/25 transition-all duration-200"
                >
                  <FiShoppingCart className="text-base" />
                  View All Products
                </Link>
              </div>

              <div className="flex flex-wrap gap-5">
                {slide.stats.map(s => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className="text-xl">{s.icon}</span>
                    <span className="text-white/70 text-xs font-semibold">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right  image card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`card-${slide.id}`}
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:flex justify-center"
            >
              <div className="relative w-80 h-72 rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                <img
                  src={slide.img.replace('w=1600&h=900', 'w=700&h=600')}
                  alt={slide.tag}
                  className="w-full h-full object-cover scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute top-4 right-4">
                  <span
                    className="text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-lg tracking-widest"
                    style={{ background: slide.badgeColor }}
                  >
                    {slide.badge}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-white font-extrabold text-lg leading-tight drop-shadow">
                    {slide.title} <span style={{ color: slide.accentColor }}>{slide.highlight}</span>
                  </p>
                  <p className="text-white/60 text-xs mt-1">{slide.tag}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Slide dots ── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className="transition-all duration-300 focus:outline-none">
            <motion.div
              animate={{ width: i === active ? 28 : 8, opacity: i === active ? 1 : 0.45 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="h-2 rounded-full bg-white"
            />
          </button>
        ))}
      </div>

      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5 pointer-events-none z-10" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none z-10" />
    </section>
  );
};

export default PharmHero;
