import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PACKAGES = [
  { name:"Healthy 2026 Full Body Checkup", desc:"Diagnostic screening & monitoring of your health", mrp:3599, price:1649, discount:54, tests:47, img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=200&fit=crop&q=80" },
  { name:"Diabetes Care Package",          desc:"Preventive care aspects specially for diabetics",  mrp:1399, price:849,  discount:39, tests:8,  img:"https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=200&fit=crop&q=80" },
  { name:"Basic Health Checkup",           desc:"Assesses 47 essential body parameters",            mrp:2249, price:1049, discount:53, tests:47, img:"https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&h=200&fit=crop&q=80" },
  { name:"Aarogyam Full Body + Vitamins",  desc:"Comprehensive vitamin and full body checkup",      mrp:4599, price:2599, discount:43, tests:72, img:"https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=200&fit=crop&q=80" },
  { name:"Thyroid Function Test",          desc:"Complete thyroid profile T3, T4 & TSH levels",     mrp:899,  price:499,  discount:44, tests:3,  img:"https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=200&fit=crop&q=80" },
  { name:"Heart Health Package",           desc:"Lipid profile, ECG & cardiac risk markers",        mrp:2999, price:1499, discount:50, tests:18, img:"https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400&h=200&fit=crop&q=80" },
];

const LabTestPackages = () => (
  <section className="py-10 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="text-xl font-bold text-gray-900">Frequently Booked Lab Tests</h2>
          <p className="text-sm text-gray-500 mt-0.5">Most popular health packages</p>
        </div>
        <Link
          to="/products"
          className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors whitespace-nowrap"
        >
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </Link>
      </motion.div>

      {/* Horizontal scroll row  always one line */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-stretch gap-4 pb-3 pt-1" style={{ minWidth: 'max-content' }}>
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -5 }}
              className="flex-shrink-0 w-60 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              {/* Image  fixed height */}
              <div className="relative h-36 flex-shrink-0 overflow-hidden">
                <img
                  src={pkg.img}
                  alt={pkg.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute top-3 right-3 bg-primary-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-lg">
                  {pkg.discount}% OFF
                </span>
              </div>

              {/* Content  flex-grow so all cards stretch to same height */}
              <div className="p-4 flex flex-col flex-1">
                {/* Fixed 2-line title */}
                <h3 className="text-sm font-bold text-gray-900 mb-1 leading-snug line-clamp-2 min-h-[2.5rem]">{pkg.name}</h3>
                {/* Fixed 2-line desc */}
                <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed min-h-[2rem]">{pkg.desc}</p>

                <div className="mb-3">
                  <span className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700 font-semibold px-2.5 py-1 rounded-full border border-primary-100">
                    🧪 {pkg.tests} Tests Included
                  </span>
                </div>

                {/* Price pushed above button, button always at bottom */}
                <div className="mt-auto">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-extrabold text-gray-900">₹{pkg.price}</span>
                    <span className="text-sm text-gray-400 line-through">₹{pkg.mrp}</span>
                  </div>
                  <button className="w-full bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-200 active:scale-95">
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {/* Trailing spacer so last card never clips */}
          <div className="flex-shrink-0 w-1" aria-hidden="true" />
        </div>
      </div>
    </div>
  </section>
);

export default LabTestPackages;
