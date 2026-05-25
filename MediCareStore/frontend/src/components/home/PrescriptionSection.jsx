import { motion } from "framer-motion";
import { FiUpload } from "react-icons/fi";

const STEPS = [
  { n: 1, title: "Upload Prescription",   desc: "Take a clear photo of your doctor's prescription" },
  { n: 2, title: "Add Delivery Address",  desc: "Enter your delivery address to place the order" },
  { n: 3, title: "We Confirm Medicines",  desc: "Our pharmacist will call you to verify the medicines" },
  { n: 4, title: "Doorstep Delivery",     desc: "Sit back! Your medicines will be delivered to you" },
];

const PrescriptionSection = () => (
  <section className="py-12 bg-gradient-to-br from-primary-50 via-white to-lime-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12 items-center">

        {/* Left  upload */}
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <span className="inline-flex items-center gap-2 text-xs font-bold text-primary-700 bg-primary-100 px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            ORDER WITH PRESCRIPTION
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-3">
            Upload Prescription &<br />Get Medicines Delivered
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Upload your prescription and our certified pharmacists will process your order. 100% genuine medicines, delivered fast.
          </p>

          {/* Upload box */}
          <div className="border-2 border-dashed border-primary-300 rounded-2xl p-6 bg-white text-center mb-6 hover:border-primary-500 transition-colors cursor-pointer group">
            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-200 transition-colors">
              <FiUpload className="text-primary-600 text-2xl" />
            </div>
            <p className="text-sm font-bold text-gray-800 mb-1">Click to upload prescription</p>
            <p className="text-xs text-gray-400">Supports JPG, PNG, PDF  Max 10MB</p>
          </div>

          <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 rounded-2xl transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2">
            <FiUpload /> Upload Prescription
          </button>
        </motion.div>

        {/* Right  steps */}
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">How does it work?</p>
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-2xl bg-primary-500 text-white font-black text-base flex items-center justify-center flex-shrink-0 shadow-md">
                {step.n}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{step.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default PrescriptionSection;
