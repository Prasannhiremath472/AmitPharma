import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const DEALS = [
  { id:1, name:"Dr. Morepen BG-03 Glucometer Kit (50 Strips)", mrp:1415, price:750,  discount:47, img:"https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200&h=200&fit=crop&q=80" },
  { id:2, name:"Cos-IQ Daily Sunscreen SPF 30 PA++++ 30ml",    mrp:599,  price:264,  discount:56, img:"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop&q=80" },
  { id:3, name:"Liveasy Calcium Magnesium D3 & Zinc 60 Tabs",  mrp:533,  price:304,  discount:43, img:"https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=200&h=200&fit=crop&q=80" },
  { id:4, name:"Durex Extra Time Packet of 10 Condoms",         mrp:324,  price:260,  discount:20, img:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&q=80" },
  { id:5, name:"Omron BP Monitor HEM-7120",                     mrp:2499, price:1899, discount:24, img:"https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200&h=200&fit=crop&q=80" },
  { id:6, name:"Himalaya Ashwagandha Immunity 60 Tabs",         mrp:260,  price:195,  discount:25, img:"https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=200&h=200&fit=crop&q=80" },
  { id:7, name:"Protein Whey Chocolate 1kg",                    mrp:1299, price:975,  discount:25, img:"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&q=80" },
  { id:8, name:"Cetaphil Moisturizing Cream 250g",              mrp:499,  price:374,  discount:25, img:"https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=200&h=200&fit=crop&q=80" },
];

const TimeBlock = ({ val, label }) => (
  <div className="flex flex-col items-center">
    <span className="bg-primary-600 text-white text-sm font-extrabold w-10 h-10 rounded-xl flex items-center justify-center shadow-md tabular-nums">
      {String(val).padStart(2, "0")}
    </span>
    <span className="text-[9px] text-gray-500 font-medium mt-0.5 uppercase tracking-wide">{label}</span>
  </div>
);

const DealsOfTheDay = () => {
  const [end] = useState(() => Date.now() + (20 * 60 + 7) * 1000);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, end - Date.now())), 1000);
    return () => clearInterval(t);
  }, [end]);

  const h = Math.floor(left / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-6 flex-wrap gap-4"
        >
          <div>
            <h2 className="text-xl font-bold text-gray-900">Deals of the Day</h2>
            <p className="text-sm text-gray-500 mt-0.5">Hurry! Limited time offers</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Countdown timer */}
            <div className="flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-2xl px-4 py-2">
              <span className="text-primary-600 text-xs font-bold tracking-wide">ENDS IN</span>
              <div className="flex items-center gap-1.5">
                {h > 0 && (
                  <>
                    <TimeBlock val={h} label="HRS" />
                    <span className="text-primary-400 font-bold text-sm mb-3">:</span>
                  </>
                )}
                <TimeBlock val={m} label="MIN" />
                <span className="text-primary-400 font-bold text-sm mb-3">:</span>
                <TimeBlock val={s} label="SEC" />
              </div>
            </div>
            <Link to="/products" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </motion.div>

        <div className="flex gap-3.5 overflow-x-auto scrollbar-hide pb-2">
          {DEALS.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to="/products"
                className="block flex-shrink-0 w-44 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 shadow-sm hover:shadow-lg transition-all duration-250 overflow-hidden group"
              >
                <div className="relative h-36 bg-gray-50 overflow-hidden">
                  <img src={d.img} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 left-2 bg-primary-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    🔥 {d.discount}% OFF
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight mb-2 min-h-[2.4rem]">{d.name}</p>
                  <div className="flex items-baseline gap-1.5 mb-2.5">
                    <span className="text-sm font-extrabold text-gray-900">₹{d.price}</span>
                    <span className="text-[11px] text-gray-400 line-through">₹{d.mrp}</span>
                  </div>
                  <button className="w-full bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold py-2 rounded-xl transition-colors duration-200">
                    Add to Cart
                  </button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealsOfTheDay;
