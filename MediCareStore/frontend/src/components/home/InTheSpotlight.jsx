import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SPOTLIGHT = [
  { id:1, name:"Everherb Karela Jamun Juice 1L",                         mrp:374,  price:210, discount:44, img:"https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=300&fit=crop&q=80" },
  { id:2, name:"Amit R. Medical Multivitamin Multimineral 60 Tabs",      mrp:619,  price:360, discount:42, img:"https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=300&h=300&fit=crop&q=80" },
  { id:3, name:"Liveasy Healthy Roasted Seed Mix 200g",                  mrp:374,  price:217, discount:42, img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop&q=80" },
  { id:4, name:"Amit R. Medical Calcium Magnesium D3 & Zinc 60 Tabs",   mrp:533,  price:304, discount:43, img:"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&q=80" },
  { id:5, name:"Amit R. Medical Orthopaedic Electric Heat Belt",         mrp:997,  price:509, discount:49, img:"https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=300&h=300&fit=crop&q=80" },
  { id:6, name:"Liveasy Ortho Care Acupressure Slippers M-7",           mrp:608,  price:341, discount:44, img:"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop&q=80" },
];

const InTheSpotlight = () => (
  <section className="py-10 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="text-xl font-bold text-gray-900">In The Spotlight</h2>
          <p className="text-sm text-gray-500 mt-0.5">Editor's top picks this week</p>
        </div>
        <Link to="/products" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {SPOTLIGHT.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -4 }}
          >
            <Link
              to="/products"
              className="block bg-white rounded-2xl border border-gray-100 hover:border-primary-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <div className="relative h-36 overflow-hidden bg-gray-50">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-2 left-2 bg-primary-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {p.discount}% OFF
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight mb-1.5">{p.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-extrabold text-gray-900">₹{p.price}</span>
                  <span className="text-[11px] text-gray-400 line-through">₹{p.mrp}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default InTheSpotlight;
