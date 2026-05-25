import { motion } from "framer-motion";

const DownloadApp = () => (
  <section className="py-16 overflow-hidden" style={{background:"linear-gradient(135deg,#1a2e05 0%,#365314 60%,#4d7c0f 100%)"}}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{opacity:0,x:-40}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-bold px-3 py-1.5 rounded-full mb-5 tracking-widest">
            =ñ DOWNLOAD APP
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
            Simplifying Healthcare,<br/>
            <span className="text-primary-300">Impacting Lives</span>
          </h2>
          <p className="text-white/60 text-base leading-relaxed mb-8 max-w-md">
            Download the app for free and get extra 5% cashback on every order. Track orders, set reminders, and consult doctors  all in one app.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="flex items-center gap-3 bg-black text-white px-5 py-3.5 rounded-2xl hover:bg-gray-900 transition-colors border border-white/10 hover:border-white/20 hover:shadow-xl">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.3.07 2.18.77 2.95.8.9-.19 1.76-.92 3.24-.99 2.21.18 3.87 1.12 4.95 2.87-4.37 2.62-3.34 8.45.86 10.18zm-6.93-17c-.44 2.3-3.66 4.46-5.97 4.68-.3-2.23 1.89-4.63 5.97-4.68z"/></svg>
              <div>
                <p className="text-[10px] text-white/60 leading-none mb-0.5">Download on the</p>
                <p className="text-sm font-bold leading-none">App Store</p>
              </div>
            </a>
            <a href="#" className="flex items-center gap-3 bg-black text-white px-5 py-3.5 rounded-2xl hover:bg-gray-900 transition-colors border border-white/10 hover:border-white/20 hover:shadow-xl">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76A2.5 2.5 0 0 1 2 21.5V2.5C2 1.67 2.67 1 3.5 1c.52 0 .97.25 1.25.63l9.25 9.25-9.25 9.25c-.28.38-.73.63-1.25.63-.13 0-.25-.02-.32 0zm12.5-5.58L5.56 12l10.12-6.18L18 7.3c.61.35 1 1 1 1.7s-.39 1.35-1 1.7l-2.32 1.3-7.8 4.76 7.8 1.42z"/></svg>
              <div>
                <p className="text-[10px] text-white/60 leading-none mb-0.5">Get it on</p>
                <p className="text-sm font-bold leading-none">Google Play</p>
              </div>
            </a>
          </div>
          <div className="flex items-center gap-6 mt-8">
            {["4.8â˜… Rated","10M+ Downloads","Free Download"].map(f => (
              <div key={f} className="text-center">
                <p className="text-white/50 text-xs font-medium">{f}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Phone mockup */}
        <motion.div initial={{opacity:0,x:40}} whileInView={{opacity:1,x:0}} viewport={{once:true}} className="hidden md:flex justify-center items-end">
          <div className="relative">
            <div className="w-52 h-96 bg-white/10 backdrop-blur-sm border border-white/20 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=800&fit=crop&q=80"
                alt="App"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="bg-primary-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg mb-3">Amit R. Medical</div>
                <div className="text-white text-xs font-medium opacity-80">Your Online Pharmacy</div>
              </div>
            </div>
            <div className="absolute -right-8 -top-6 w-36 h-24 bg-white rounded-2xl shadow-xl p-3 border border-gray-100">
              <p className="text-[10px] text-gray-500 font-medium">Latest Order</p>
              <p className="text-xs font-bold text-gray-900 mt-0.5">Shelcal 500mg</p>
              <div className="flex items-center gap-1 mt-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/>
                <span className="text-[10px] text-green-600 font-semibold">Out for delivery</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default DownloadApp;

