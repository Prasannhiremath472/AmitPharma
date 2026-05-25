import { motion } from "framer-motion";

const STATS = [
  { value: "51M+", label: "Registered Users",    sub: "as of Aug 2025",        icon: "ðŸ‘¥", color: "from-primary-500 to-primary-600" },
  { value: "71M+", label: "Orders Delivered",    sub: "till date",             icon: "=æ", color: "from-primary-600 to-lime-700" },
  { value: "60K+", label: "Unique Products",     sub: "sold in last 6 months", icon: "<÷",  color: "from-lime-500 to-primary-600" },
  { value: "19K+", label: "Pin Codes Served",    sub: "in last 3 months",      icon: "=Í", color: "from-primary-500 to-lime-600" },
];

const WhyChooseUs = () => (
  <section className="py-12 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl font-black text-gray-900">Why Choose Us?</h2>
        <p className="text-gray-500 text-sm mt-2">India's most trusted online pharmacy platform</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="relative bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300 overflow-hidden text-center group"
          >
            {/* Top accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.color} rounded-t-3xl`} />
            {/* Icon */}
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
              {s.icon}
            </div>
            {/* Value */}
            <div className={`text-3xl font-black bg-gradient-to-br ${s.color} bg-clip-text text-transparent mb-1`}>
              {s.value}
            </div>
            <div className="text-sm font-bold text-gray-800">{s.label}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Trust strip */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-6"
      >
        {[" 100% Genuine Medicines", "=š Fast & Reliable Delivery", "= Secure Payments", "=¬ 24/7 Customer Support", "ðŸ¥ Licensed Pharmacists"].map(t => (
          <span key={t} className="text-sm text-gray-500 font-medium">{t}</span>
        ))}
      </motion.div>
    </div>
  </section>
);

export default WhyChooseUs;
