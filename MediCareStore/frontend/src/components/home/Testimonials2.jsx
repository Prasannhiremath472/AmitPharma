import { motion } from "framer-motion";

const REVIEWS = [
  { name:"Niti Rohan",    date:"December 11, 2024", rating:5, avatar:"NR", color:"bg-primary-500",
    text:"I ordered my dad's heart medication late in the evening and it was delivered the next morning. The process was really smooth, and I even got a good discount. Making repeat orders is even more convenient." },
  { name:"Yogesh Shukla", date:"January 10, 2025",  rating:5, avatar:"YS", color:"bg-primary-600",
    text:"I had mistakenly ordered the wrong strip of tablets but customer support made the return super easy. They arranged a return pickup and my refund was processed in just 2 days." },
  { name:"Anuj Kumar",    date:"March 12, 2025",    rating:5, avatar:"AK", color:"bg-lime-600",
    text:"Amit R. Medical is the best app for ordering medicines and healthcare products. I have been using it for the last 5 years. The customer support is also really good." },
  { name:"Meha Jain",     date:"April 3, 2025",     rating:5, avatar:"MJ", color:"bg-primary-700",
    text:"Excellent app for medicines and body check-ups. The app gives you the option to select from generic medicines which helps save a lot of money. Loved it." },
];

const Stars = ({ n }) => (
  <div className="flex gap-0.5">
    {Array(5).fill(0).map((_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < n ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ))}
  </div>
);

const Testimonials2 = () => (
  <section className="py-12 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl font-black text-gray-900">What Our Customers Say</h2>
        <p className="text-gray-500 text-sm mt-2">Trusted by millions across India</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {REVIEWS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-300 flex flex-col"
          >
            {/* Quote mark */}
            <div className="text-5xl text-primary-100 font-serif leading-none mb-2 select-none">"</div>
            <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-5">{r.text}</p>
            <div className="border-t border-gray-50 pt-4">
              <Stars n={r.rating} />
              <div className="flex items-center gap-3 mt-3">
                <div className={`w-9 h-9 rounded-full ${r.color} text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0`}>
                  {r.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{r.name}</p>
                  <p className="text-[11px] text-gray-400">{r.date}</p>
                </div>
                <div className="ml-auto">
                  <span className="bg-primary-50 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary-100">✓ Verified</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials2;
