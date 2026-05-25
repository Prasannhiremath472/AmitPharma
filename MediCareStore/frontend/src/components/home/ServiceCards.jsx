import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SERVICES = [
  {
    label: 'Medicine',
    badge: 'SAVE 27%',
    badgeClass: 'bg-blue-600',
    link: '/products',
    bg: 'bg-blue-50',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-8 h-8">
        <rect x="8" y="20" width="48" height="30" rx="6" fill="#3b82f6" opacity=".15"/>
        <rect x="20" y="10" width="24" height="44" rx="5" fill="#3b82f6" opacity=".25"/>
        <rect x="26" y="8" width="12" height="48" rx="4" fill="#2563eb"/>
        <rect x="20" y="28" width="24" height="8" rx="2" fill="#93c5fd"/>
        <circle cx="32" cy="20" r="5" fill="#1d4ed8"/>
        <rect x="30" y="17" width="4" height="6" rx="1" fill="white"/>
        <rect x="29" y="19" width="6" height="2" rx="1" fill="white"/>
      </svg>
    ),
  },
  {
    label: 'Lab Tests',
    badge: 'BUY 1 GET 1',
    badgeClass: 'bg-emerald-600',
    link: '/products',
    bg: 'bg-emerald-50',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-8 h-8">
        <rect x="22" y="8" width="8" height="28" rx="3" fill="#059669" opacity=".3"/>
        <rect x="34" y="8" width="8" height="28" rx="3" fill="#059669" opacity=".3"/>
        <path d="M18 36 L10 54 Q10 58 14 58 H50 Q54 58 54 54 L46 36 Z" fill="#10b981" opacity=".2"/>
        <path d="M18 36 L10 54 Q10 58 14 58 H50 Q54 58 54 54 L46 36 Z" fill="none" stroke="#059669" strokeWidth="2"/>
        <ellipse cx="32" cy="50" rx="12" ry="5" fill="#34d399" opacity=".5"/>
        <rect x="24" y="8" width="4" height="4" rx="1" fill="#065f46"/>
        <rect x="36" y="8" width="4" height="4" rx="1" fill="#065f46"/>
        <line x1="26" y1="44" x2="38" y2="44" stroke="#059669" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="25" cy="49" r="2" fill="#059669"/>
        <circle cx="32" cy="52" r="2" fill="#059669"/>
        <circle cx="39" cy="49" r="2" fill="#059669"/>
      </svg>
    ),
  },
  {
    label: 'Doctor Consult',
    badge: 'FROM ₹199',
    badgeClass: 'bg-orange-500',
    link: '/products',
    bg: 'bg-orange-50',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-8 h-8">
        <circle cx="32" cy="18" r="12" fill="#fed7aa"/>
        <circle cx="32" cy="18" r="9" fill="#fb923c"/>
        <rect x="20" y="28" width="24" height="28" rx="6" fill="#fdba74"/>
        <rect x="24" y="28" width="16" height="20" rx="3" fill="#fff7ed"/>
        <path d="M28 38 Q32 34 36 38" stroke="#f97316" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <circle cx="27" cy="35" r="2" fill="#f97316"/>
        <circle cx="37" cy="35" r="2" fill="#f97316"/>
        <rect x="30" y="50" width="4" height="6" rx="1" fill="#fdba74"/>
        <path d="M26 56 Q32 58 38 56" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <circle cx="44" cy="40" r="8" fill="white" stroke="#f97316" strokeWidth="2"/>
        <path d="M41 40 h6 M44 37 v6" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Branded Substitute',
    badge: 'UPTO 50% OFF',
    badgeClass: 'bg-purple-600',
    link: '/products',
    bg: 'bg-purple-50',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-8 h-8">
        <rect x="8" y="14" width="20" height="36" rx="4" fill="#8b5cf6" opacity=".3"/>
        <rect x="10" y="16" width="16" height="32" rx="3" fill="#7c3aed" opacity=".5"/>
        <rect x="36" y="14" width="20" height="36" rx="4" fill="#a78bfa" opacity=".3"/>
        <rect x="38" y="16" width="16" height="32" rx="3" fill="#7c3aed" opacity=".5"/>
        <path d="M28 32 L36 32" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round"/>
        <path d="M33 28 L37 32 L33 36" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <rect x="11" y="20" width="14" height="4" rx="2" fill="white" opacity=".7"/>
        <rect x="11" y="28" width="10" height="2" rx="1" fill="white" opacity=".5"/>
        <rect x="39" y="20" width="14" height="4" rx="2" fill="white" opacity=".7"/>
        <rect x="39" y="28" width="10" height="2" rx="1" fill="white" opacity=".5"/>
      </svg>
    ),
  },
  {
    label: 'Healthcare',
    badge: 'UPTO 60% OFF',
    badgeClass: 'bg-pink-600',
    link: '/products',
    bg: 'bg-pink-50',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-8 h-8">
        <path d="M32 54 C32 54 10 40 10 24 A12 12 0 0 1 32 18 A12 12 0 0 1 54 24 C54 40 32 54 32 54Z" fill="#f9a8d4" opacity=".5"/>
        <path d="M32 50 C32 50 12 37 12 24 A10 10 0 0 1 32 20 A10 10 0 0 1 52 24 C52 37 32 50 32 50Z" fill="#ec4899" opacity=".3"/>
        <path d="M32 46 C32 46 16 35 16 24 A8 8 0 0 1 32 22 A8 8 0 0 1 48 24 C48 35 32 46 32 46Z" fill="#be185d" opacity=".4"/>
        <path d="M26 30 H30 V26 H34 V30 H38 V34 H34 V38 H30 V34 H26 Z" fill="white"/>
      </svg>
    ),
  },
  {
    label: 'Health Blogs',
    badge: 'READ MORE',
    badgeClass: 'bg-teal-600',
    link: '/',
    bg: 'bg-teal-50',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-8 h-8">
        <rect x="10" y="10" width="44" height="50" rx="5" fill="#99f6e4" opacity=".4"/>
        <rect x="14" y="14" width="36" height="42" rx="3" fill="white"/>
        <rect x="18" y="20" width="28" height="3" rx="1.5" fill="#0d9488"/>
        <rect x="18" y="27" width="22" height="2" rx="1" fill="#ccfbf1"/>
        <rect x="18" y="32" width="25" height="2" rx="1" fill="#ccfbf1"/>
        <rect x="18" y="37" width="20" height="2" rx="1" fill="#ccfbf1"/>
        <rect x="18" y="42" width="15" height="2" rx="1" fill="#ccfbf1"/>
        <circle cx="46" cy="48" r="8" fill="#0d9488"/>
        <path d="M43 48 h6 M46 45 v6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'PLUS',
    badge: 'SAVE 5% EXTRA',
    badgeClass: 'bg-amber-500',
    link: '/',
    bg: 'bg-amber-50',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-8 h-8">
        <polygon points="32,6 39,24 58,24 43,36 49,54 32,43 15,54 21,36 6,24 25,24" fill="#fde68a" opacity=".5"/>
        <polygon points="32,10 38,26 55,26 41,36 47,52 32,43 17,52 23,36 9,26 26,26" fill="#f59e0b"/>
        <polygon points="32,16 37,29 51,29 40,37 44,50 32,43 20,50 24,37 13,29 27,29" fill="#fbbf24"/>
        <text x="32" y="36" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">★</text>
      </svg>
    ),
  },
  {
    label: 'Offers',
    badge: "TODAY'S DEALS",
    badgeClass: 'bg-red-600',
    link: '/products',
    bg: 'bg-red-50',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-8 h-8">
        <rect x="8" y="16" width="48" height="34" rx="6" fill="#fca5a5" opacity=".4"/>
        <rect x="10" y="18" width="44" height="30" rx="5" fill="#ef4444" opacity=".2"/>
        <path d="M10 28 H54" stroke="#dc2626" strokeWidth="2" opacity=".5"/>
        <rect x="16" y="32" width="14" height="10" rx="3" fill="#dc2626" opacity=".7"/>
        <rect x="34" y="32" width="14" height="10" rx="3" fill="#dc2626" opacity=".7"/>
        <path d="M32 10 L32 20" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M26 12 L26 20" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
        <path d="M38 12 L38 20" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
        <text x="23" y="41" fill="white" fontSize="7" fontWeight="bold">50%</text>
        <text x="37" y="41" fill="white" fontSize="7" fontWeight="bold">OFF</text>
      </svg>
    ),
  },
  {
    label: 'Value Store',
    badge: 'UPTO 50% OFF',
    badgeClass: 'bg-indigo-600',
    link: '/products',
    bg: 'bg-indigo-50',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-8 h-8">
        <path d="M10 20 L16 10 H48 L54 20 H10Z" fill="#818cf8" opacity=".4"/>
        <rect x="10" y="20" width="44" height="34" rx="4" fill="#6366f1" opacity=".2"/>
        <rect x="12" y="22" width="40" height="30" rx="3" fill="white" opacity=".5"/>
        <circle cx="24" cy="52" r="4" fill="#4338ca"/>
        <circle cx="44" cy="52" r="4" fill="#4338ca"/>
        <path d="M14 28 H50" stroke="#6366f1" strokeWidth="1.5" opacity=".5"/>
        <rect x="18" y="32" width="8" height="10" rx="2" fill="#818cf8" opacity=".7"/>
        <rect x="28" y="32" width="8" height="10" rx="2" fill="#818cf8" opacity=".7"/>
        <rect x="38" y="32" width="8" height="10" rx="2" fill="#818cf8" opacity=".7"/>
      </svg>
    ),
  },
];

const ServiceCards = () => (
  <section className="bg-white border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

      {/* Service icon row */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
        {SERVICES.map((svc, i) => (
          <motion.div
            key={svc.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            whileHover={{ y: -3 }}
            className="flex-shrink-0"
          >
            <Link to={svc.link} className="flex flex-col items-center gap-2 w-[86px] group cursor-pointer">
              {/* Icon tile */}
              <div className={`w-16 h-16 rounded-2xl ${svc.bg} flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105`}>
                {svc.icon}
              </div>
              <span className="text-[11px] font-semibold text-gray-700 text-center leading-tight">{svc.label}</span>
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full text-white text-center ${svc.badgeClass} tracking-wide`}>
                {svc.badge}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Upload Prescription bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.25 }}
        className="mt-4 flex items-center gap-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/70 rounded-2xl px-5 py-3.5"
      >
        <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-800">Order with Prescription</p>
          <p className="text-xs text-gray-500 mt-0.5">Upload prescription and get medicines delivered to your doorstep</p>
        </div>
        <button className="flex-shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-md whitespace-nowrap active:scale-95">
          Upload Now
        </button>
      </motion.div>
    </div>
  </section>
);

export default ServiceCards;
