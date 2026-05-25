import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Each image is specifically matched to the health concern
const CONCERNS = [
  {
    name: "Health Checkups",
    img: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=160&h=160&fit=crop&auto=format&q=80",
    // doctor with clipboard / full body checkup
  },
  {
    name: "Vitamins",
    img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=160&h=160&fit=crop&auto=format&q=80",
    // pill capsules / vitamin tablets
  },
  {
    name: "Diabetes Tests",
    img: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=160&h=160&fit=crop&auto=format&q=80",
    // glucometer blood glucose test
  },
  {
    name: "Women Care",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=160&h=160&fit=crop&auto=format&q=80",
    // woman wellness
  },
  {
    name: "Fever & Infection",
    img: "https://images.unsplash.com/photo-1617727553252-65863c156eb0?w=160&h=160&fit=crop&auto=format&q=80",
    // thermometer / fever
  },
  {
    name: "Thyroid",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=160&h=160&fit=crop&auto=format&q=80",
    // lab test / blood sample
  },
  {
    name: "Heart",
    img: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=160&h=160&fit=crop&auto=format&q=80",
    // ECG / heart monitor
  },
  {
    name: "Allergy",
    img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=160&h=160&fit=crop&auto=format&q=80&sat=-80",
    // medicine / antiallergy
  },
  {
    name: "Lifestyle Tests",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=160&h=160&fit=crop&auto=format&q=80",
    // healthy lifestyle / fitness
  },
  {
    name: "Hair & Skin",
    img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=160&h=160&fit=crop&auto=format&q=80",
    // skincare / hair care products
  },
];

const LabTestsSection = () => (
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
          <h2 className="text-xl font-bold text-gray-900">Lab Tests by Health Concern</h2>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs text-gray-400">Powered by</span>
            <span className="text-xs font-extrabold text-orange-500 tracking-wider">THYROCARE</span>
          </div>
        </div>
        <Link
          to="/products"
          className="text-sm font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 transition-colors"
        >
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </motion.div>

      {/* Cards row */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {CONCERNS.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="flex-shrink-0"
          >
            <Link to="/products" className="flex flex-col items-center gap-2.5 group cursor-pointer w-[72px]">
              {/* Circle image */}
              <div className="w-[68px] h-[68px] rounded-full overflow-hidden ring-2 ring-gray-100 group-hover:ring-purple-200 shadow-sm group-hover:shadow-md transition-all duration-300">
                <img
                  src={c.img}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400"
                />
              </div>
              <span className="text-[11px] font-semibold text-gray-700 text-center leading-tight">
                {c.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default LabTestsSection;
