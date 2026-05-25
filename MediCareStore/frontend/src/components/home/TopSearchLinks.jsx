import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SEARCH_SECTIONS = [
  {
    title: 'Top Tests',
    links: ['Complete Blood Count', 'HbA1c Test', 'Thyroid Profile', 'Vitamin D Test', 'Vitamin B12 Test', 'Lipid Profile', 'Liver Function Test', 'Kidney Function Test'],
  },
  {
    title: 'Top-Selling Healthcare Products',
    links: ['Omron BP Monitor', 'Accu-Chek Glucometer', 'Heating Pad', 'Nebulizer Machine', 'Oximeter', 'Thermometer Digital', 'Weighing Scale'],
  },
  {
    title: 'Top-Selling Medicines',
    links: ['Pantoprazole', 'Atorvastatin', 'Metformin', 'Amlodipine', 'Levothyroxine', 'Cetirizine', 'Paracetamol 500mg'],
  },
  {
    title: 'Top-Searched Medicines',
    links: ['Dolo 650', 'Azithromycin', 'Ivermectin', 'Remdesivir', 'Favipiravir', 'Vitamins C Tablets', 'Zinc Tablets'],
  },
  {
    title: 'Top Searched Vaccines',
    links: ['COVID-19 Vaccine', 'Influenza Vaccine', 'HPV Vaccine', 'Hepatitis B Vaccine', 'Typhoid Vaccine', 'Meningococcal Vaccine'],
  },
];

const TopSearchLinks = () => {
  return (
    <section className="py-8 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-5"
        >
          {SEARCH_SECTIONS.map((section, si) => (
            <div key={section.title}>
              <h3 className="text-sm font-bold text-gray-700 mb-2">{section.title}</h3>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {section.links.map((link, li) => (
                  <Link
                    key={li}
                    to="/products"
                    className="flex-shrink-0 text-xs text-purple-700 border border-purple-200 hover:bg-purple-50 px-3 py-1.5 rounded-full transition-colors duration-200 whitespace-nowrap"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TopSearchLinks;
