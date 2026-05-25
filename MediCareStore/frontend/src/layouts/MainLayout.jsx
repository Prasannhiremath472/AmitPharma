import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import CartSidebar from '../components/cart/CartSidebar';
import WhatsAppButton from '../components/home/WhatsAppButton';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <CartSidebar />
      <motion.main
        className="flex-1"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Outlet />
      </motion.main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default MainLayout;
