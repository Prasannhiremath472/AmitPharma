import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CountdownTimer = () => {
  const getEndTime = () => {
    const end = new Date();
    end.setHours(23, 59, 59, 0);
    return end;
  };

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const end = getEndTime();
      const diff = end - now;
      if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
      return {
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      };
    };

    setTimeLeft(calculate());
    const interval = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section className="py-12 bg-gradient-to-r from-red-600 to-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white text-center md:text-left">
            <p className="text-sm font-semibold text-red-100 uppercase tracking-wider mb-1">⚡ Flash Sale - Today Only!</p>
            <h2 className="text-3xl font-bold font-heading">Up to 50% OFF</h2>
            <p className="text-red-100 mt-1">On selected medicines and health products</p>
          </div>

          <div className="flex items-center gap-3">
            {[
              { value: pad(timeLeft.hours), label: 'HRS' },
              { value: pad(timeLeft.minutes), label: 'MIN' },
              { value: pad(timeLeft.seconds), label: 'SEC' },
            ].map(({ value, label }, index) => (
              <div key={label} className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center min-w-[70px]">
                  <motion.div
                    key={value}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl font-bold text-white font-mono"
                  >
                    {value}
                  </motion.div>
                  <div className="text-[10px] text-red-100 font-semibold mt-0.5">{label}</div>
                </div>
                {index < 2 && <span className="text-white text-2xl font-bold">:</span>}
              </div>
            ))}
          </div>

          <Link
            to="/products?sortBy=created_at&sortOrder=DESC"
            className="bg-white text-red-600 font-bold px-8 py-4 rounded-2xl hover:bg-red-50 transition-colors whitespace-nowrap"
          >
            Shop Flash Sale
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CountdownTimer;
