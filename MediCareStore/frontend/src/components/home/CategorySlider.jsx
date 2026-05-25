import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import api from '../../api/axios';
import { PRODUCT_CATEGORIES } from '../../constants';

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data.length > 0 ? res.data.data : PRODUCT_CATEGORIES.map(c => ({ ...c, id: c.slug })));
      } catch {
        setCategories(PRODUCT_CATEGORIES.map(c => ({ ...c, id: c.slug })));
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const displayCategories = categories.length > 0 ? categories : PRODUCT_CATEGORIES;

  const categoryColors = ['bg-sky-50', 'bg-emerald-50', 'bg-orange-50', 'bg-pink-50', 'bg-purple-50', 'bg-yellow-50', 'bg-red-50', 'bg-indigo-50'];
  const iconColors = ['text-sky-600', 'text-emerald-600', 'text-orange-600', 'text-pink-600', 'text-purple-600', 'text-yellow-600', 'text-red-600', 'text-indigo-600'];
  const emojis = ['=Š', '<?', '>ô', '=v', '<1', '>z', '=7', '=ª'];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 font-heading">Shop by Category</h2>
            <p className="text-slate-500 mt-1">Find what you need in our wide selection</p>
          </div>
          <Link to="/categories" className="text-primary-600 font-semibold text-sm hover:text-primary-700 flex items-center gap-1">
            View All â†’
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-slate-200 rounded-2xl animate-pulse" />
                <div className="h-3 bg-slate-200 rounded animate-pulse w-16" />
              </div>
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={4}
            spaceBetween={16}
            navigation
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              0: { slidesPerView: 3 },
              480: { slidesPerView: 4 },
              640: { slidesPerView: 5 },
              768: { slidesPerView: 6 },
              1024: { slidesPerView: 8 },
            }}
          >
            {displayCategories.slice(0, 12).map((cat, index) => (
              <SwiperSlide key={cat.id || cat.slug}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className={`w-16 h-16 ${categoryColors[index % categoryColors.length]} rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-10 h-10 object-cover rounded-xl" />
                      ) : (
                        <span>{cat.icon || emojis[index % emojis.length]}</span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-slate-600 group-hover:text-primary-600 text-center leading-tight max-w-[72px]">
                      {cat.name}
                    </span>
                  </Link>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default CategorySlider;
