import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const BANNERS = [
  {
    id: 1,
    title: 'Medicines',
    sub: 'Save upto 27%',
    tag: '27% OFF',
    tagBg: 'bg-primary-500',
    gradient: 'from-green-950/80 via-green-900/50 to-transparent',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=200&fit=crop&auto=format&q=80',
    link: '/products',
  },
  {
    id: 2,
    title: 'Vitamins',
    sub: 'Boost your immunity',
    tag: 'UP TO 40% OFF',
    tagBg: 'bg-primary-500',
    gradient: 'from-lime-950/80 via-lime-900/50 to-transparent',
    img: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=200&fit=crop&auto=format&q=80',
    link: '/products',
  },
  {
    id: 3,
    title: 'Hot Deals',
    sub: 'Up to 60% off today',
    tag: '60% OFF',
    tagBg: 'bg-red-500',
    gradient: 'from-red-950/80 via-red-900/50 to-transparent',
    img: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=200&fit=crop&auto=format&q=80',
    link: '/products',
  },
  {
    id: 4,
    title: 'Nutrition',
    sub: 'Supplements & more',
    tag: 'NEW',
    tagBg: 'bg-primary-500',
    gradient: 'from-green-950/80 via-green-900/50 to-transparent',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=200&fit=crop&auto=format&q=80',
    link: '/products',
  },
  {
    id: 5,
    title: "Women's Care",
    sub: 'Products just for her',
    tag: 'SPECIAL',
    tagBg: 'bg-pink-500',
    gradient: 'from-pink-950/80 via-pink-900/50 to-transparent',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop&auto=format&q=80',
    link: '/products',
  },
  {
    id: 6,
    title: 'Diabetes Care',
    sub: 'Monitor & manage',
    tag: 'ESSENTIAL',
    tagBg: 'bg-amber-500',
    gradient: 'from-amber-950/80 via-amber-900/50 to-transparent',
    img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=200&fit=crop&auto=format&q=80',
    link: '/products',
  },
  {
    id: 7,
    title: 'Skin Care',
    sub: 'Glow up this season',
    tag: 'TRENDING',
    tagBg: 'bg-primary-500',
    gradient: 'from-green-950/80 via-green-900/50 to-transparent',
    img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=200&fit=crop&auto=format&q=80',
    link: '/products',
  },
  {
    id: 8,
    title: 'Baby Care',
    sub: 'Gentle care for little ones',
    tag: 'SALE',
    tagBg: 'bg-cyan-500',
    gradient: 'from-cyan-950/80 via-cyan-900/50 to-transparent',
    img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=200&fit=crop&auto=format&q=80',
    link: '/products',
  },
  {
    id: 9,
    title: 'Ayurveda',
    sub: 'Natural & herbal range',
    tag: 'HERBAL',
    tagBg: 'bg-primary-600',
    gradient: 'from-green-950/80 via-green-900/50 to-transparent',
    img: 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=400&h=200&fit=crop&auto=format&q=80',
    link: '/products',
  },
  {
    id: 10,
    title: 'Fitness',
    sub: 'Protein & sports nutrition',
    tag: 'NEW',
    tagBg: 'bg-primary-500',
    gradient: 'from-lime-950/80 via-lime-900/50 to-transparent',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=200&fit=crop&auto=format&q=80',
    link: '/products',
  },
];

const SecondaryBanners = () => (
  <section className="py-6 bg-gray-50">
    <div className="max-w-7xl mx-auto">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 px-4 sm:px-6 lg:px-8 pb-3 pt-1">
          {BANNERS.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              whileHover={{ y: -4, scale: 1.03 }}
              className="flex-shrink-0"
            >
              <Link to={b.link} className="block">
                <div className="relative w-52 h-32 rounded-2xl overflow-hidden shadow-md cursor-pointer group">
                  <img
                    src={b.img}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${b.gradient}`} />
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-white/0 group-hover:ring-white/30 transition-all duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-between p-3.5">
                    <div className="flex justify-end">
                      <span className={`${b.tagBg} text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shadow-lg tracking-widest`}>
                        {b.tag}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-extrabold leading-tight drop-shadow">{b.title}</p>
                      <p className="text-white/70 text-[10px] font-medium leading-tight mt-0.5">{b.sub}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          <div className="flex-shrink-0 w-1" aria-hidden="true" />
        </div>
      </div>
    </div>
  </section>
);

export default SecondaryBanners;
