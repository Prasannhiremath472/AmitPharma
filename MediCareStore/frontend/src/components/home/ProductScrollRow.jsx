import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PRODUCT_IMGS = [
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=200&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=200&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=200&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=200&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=200&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200&h=200&fit=crop&q=80",
];

const ViewAllLink = ({ to }) => (
  <Link to={to} className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors whitespace-nowrap">
    View All
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
    </svg>
  </Link>
);

const ProductCard = ({ product, index }) => (
  <Link
    to="/products"
    className="block flex-shrink-0 w-44 bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary-200 shadow-sm hover:shadow-lg transition-all duration-250 group cursor-pointer"
  >
    <div className="relative w-full h-36 bg-gray-50 overflow-hidden">
      <img
        src={PRODUCT_IMGS[index % PRODUCT_IMGS.length]}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
      />
      {product.discount > 0 && (
        <div className="absolute top-2 left-2 bg-primary-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
          {product.discount}% OFF
        </div>
      )}
    </div>
    <div className="p-3">
      <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight mb-2 min-h-[2.4rem]">{product.name}</p>
      <div className="flex items-baseline gap-1.5 mb-2.5">
        <span className="text-sm font-extrabold text-gray-900">₹{product.price}</span>
        {product.mrp > product.price && (
          <span className="text-[11px] text-gray-400 line-through">₹{product.mrp}</span>
        )}
      </div>
      <button className="w-full bg-primary-500 hover:bg-primary-600 active:scale-95 text-white text-xs font-bold py-2 rounded-xl transition-all duration-200">
        Add to Cart
      </button>
    </div>
  </Link>
);

const ProductScrollRow = ({ title, subtitle, products, viewAllLink = "/products", bg = "bg-white" }) => (
  <section className={`py-10 ${bg}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-end justify-between mb-5"
      >
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <ViewAllLink to={viewAllLink} />
      </motion.div>
      <div className="flex gap-3.5 overflow-x-auto scrollbar-hide pb-2">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
          >
            <ProductCard product={p} index={i} />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductScrollRow;
