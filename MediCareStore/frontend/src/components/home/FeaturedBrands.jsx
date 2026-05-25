import { motion } from "framer-motion";

const BRANDS = [
  "Sugar Free","Bontress","Sebamed","Biluma","Diataal","Penegra",
  "Venusia","Cetaphil","Mums Care","Supradyn","Cos-iq","Vantej",
  "Scalpe Plus","CIR","Shelcal","Dr Morepen","Polycrol","LivEasy"
];

// All shades in lime-green / primary palette
const COLORS = [
  "bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100",
  "bg-lime-50 text-lime-700 border-lime-200 hover:bg-lime-100",
  "bg-primary-100 text-primary-800 border-primary-200 hover:bg-primary-200",
  "bg-lime-100 text-lime-800 border-lime-200 hover:bg-lime-200",
  "bg-primary-50 text-primary-600 border-primary-100 hover:bg-primary-100",
  "bg-lime-50 text-lime-600 border-lime-100 hover:bg-lime-100",
];

const FeaturedBrands = () => (
  <section className="py-10 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-7"
      >
        <h2 className="text-xl font-bold text-gray-900">Featured Brands</h2>
        <p className="text-sm text-gray-500 mt-1">Pick from our favourite brands</p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-3">
        {BRANDS.map((b, i) => (
          <motion.button
            key={b}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ scale: 1.07, y: -2 }}
            className={`text-sm font-bold px-5 py-2.5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${COLORS[i % COLORS.length]}`}
          >
            {b}
          </motion.button>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedBrands;
