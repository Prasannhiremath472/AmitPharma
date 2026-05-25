import { motion } from "framer-motion";

const PLUSBanner = () => (
  <section className="py-6 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl"
        style={{ background: "linear-gradient(135deg,#1a2e05 0%,#365314 55%,#4d7c0f 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-white/5" />
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-8">
          {/* Left  icon + text */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-primary-400 flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-3xl">P</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-primary-300 text-xl font-black tracking-tight">PLUS</span>
                <span className="bg-primary-400/20 text-primary-200 text-xs font-bold px-2 py-0.5 rounded-full border border-primary-400/30">MEMBER</span>
              </div>
              <h3 className="text-white text-xl font-bold leading-tight">Become a Plus Member</h3>
              <p className="text-white/60 text-sm mt-0.5">Extra savings on medicines &amp; healthcare products</p>
            </div>
          </div>

          {/* Middle  benefits */}
          <div className="flex items-center gap-6">
            {["5% Extra Off", "Priority Support", "Early Access"].map(f => (
              <div key={f} className="text-center hidden md:block">
                <div className="w-2 h-2 rounded-full bg-primary-400 mx-auto mb-1.5" />
                <span className="text-white/80 text-xs font-medium whitespace-nowrap">{f}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button className="flex-shrink-0 bg-primary-400 hover:bg-primary-300 text-gray-900 font-extrabold px-8 py-3.5 rounded-2xl transition-all duration-200 hover:shadow-xl hover:scale-105 text-sm whitespace-nowrap">
            Explore Now →
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default PLUSBanner;
