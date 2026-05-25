import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ARTICLES = [
  { title:"Smog: Causes and Ways To Protect Yourself",                         cat:"Health & Wellness", time:"5 min", img:"https://images.unsplash.com/photo-1533827432537-70133df793b3?w=400&h=220&fit=crop&q=80" },
  { title:"GLP-1 Receptor Agonist and Its Role in Weight Management",         cat:"Weight Management", time:"7 min", img:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=220&fit=crop&q=80" },
  { title:"Caring for a Baby with Blocked Nose: Simple Tips",                 cat:"Baby Care",         time:"4 min", img:"https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=220&fit=crop&q=80" },
  { title:"Vomiting in Kids: Causes, Home Remedies & Treatment",              cat:"Kids Health",       time:"5 min", img:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=220&fit=crop&q=80" },
  { title:"Rickets in Children: Causes, Symptoms, Types & Treatment",         cat:"Kids Health",       time:"6 min", img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=220&fit=crop&q=80" },
  { title:"Baby Loose Motion: Causes, Home Remedies to Stop It Fast",         cat:"Baby Care",         time:"4 min", img:"https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=220&fit=crop&q=80" },
  { title:"Oral Thrush in Babies: How to Manage It Safely at Home",           cat:"Baby Care",         time:"5 min", img:"https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=220&fit=crop&q=80" },
  { title:"Why Your Baby Isn't Sleeping and How to Help",                     cat:"Parenting",         time:"6 min", img:"https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=400&h=220&fit=crop&q=80" },
];

// All category badges in lime-green family shades
const CAT_COLORS = {
  "Health & Wellness": "bg-primary-100 text-primary-700",
  "Weight Management": "bg-lime-100 text-lime-700",
  "Baby Care":         "bg-primary-50 text-primary-600",
  "Kids Health":       "bg-lime-50 text-lime-600",
  "Parenting":         "bg-primary-100 text-primary-700",
};

const HealthArticles = () => (
  <section className="py-10 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="text-xl font-bold text-gray-900">Health Articles</h2>
          <p className="text-sm text-gray-500 mt-0.5">Expert-reviewed health insights</p>
        </div>
        <Link to="/" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ARTICLES.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 hover:border-primary-200 transition-all duration-300 group cursor-pointer"
          >
            <div className="h-40 overflow-hidden">
              <img src={a.img} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${CAT_COLORS[a.cat] || "bg-primary-50 text-primary-600"}`}>
                  {a.cat}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">{a.time} read</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-3">{a.title}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HealthArticles;
