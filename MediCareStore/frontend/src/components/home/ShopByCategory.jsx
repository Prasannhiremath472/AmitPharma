import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { name:"Must Haves",           img:"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=160&h=160&fit=crop&q=80", link:"/products" },
  { name:"Vitamin Store",        img:"https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=160&h=160&fit=crop&q=80", link:"/products?category=vitamins" },
  { name:"Personal Care",        img:"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=160&h=160&fit=crop&q=80", link:"/products?category=personal-care" },
  { name:"Sexual Wellness",      img:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=160&h=160&fit=crop&q=80", link:"/products" },
  { name:"Summer Store",         img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=160&h=160&fit=crop&q=80", link:"/products" },
  { name:"Pet Care",             img:"https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=160&h=160&fit=crop&q=80", link:"/products" },
  { name:"Health Food & Drinks", img:"https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=160&h=160&fit=crop&q=80", link:"/products" },
  { name:"Diabetes Essentials",  img:"https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=160&h=160&fit=crop&q=80", link:"/products" },
  { name:"Ayurvedic Care",       img:"https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=160&h=160&fit=crop&q=80", link:"/products" },
  { name:"Mother & Baby Care",   img:"https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=160&h=160&fit=crop&q=80", link:"/products" },
  { name:"Mobility & Elderly",   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=160&h=160&fit=crop&q=80", link:"/products" },
  { name:"Sports Nutrition",     img:"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=160&h=160&fit=crop&q=80", link:"/products" },
  { name:"Healthcare Devices",   img:"https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=160&h=160&fit=crop&q=80", link:"/products" },
  { name:"Skin Care",            img:"https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=160&h=160&fit=crop&q=80", link:"/products" },
  { name:"Health Concerns",      img:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=160&h=160&fit=crop&q=80", link:"/products" },
  { name:"Explore More",         img:"https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=160&h=160&fit=crop&q=80", link:"/products" },
];

const ShopByCategory = () => (
  <section className="py-10 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="text-xl font-bold text-gray-900">Shop by Category</h2>
          <p className="text-sm text-gray-500 mt-0.5">Everything you need in one place</p>
        </div>
        <Link to="/products" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors">
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </Link>
      </motion.div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-x-4 gap-y-6">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ y: -4 }}
          >
            <Link to={cat.link} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md group-hover:ring-2 group-hover:ring-primary-400 transition-all duration-300 ring-1 ring-white">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-[11px] font-semibold text-gray-700 text-center leading-tight group-hover:text-primary-600 transition-colors">{cat.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ShopByCategory;
