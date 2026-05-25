import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';
import Logo from '../common/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <Logo size="md" dark showTagline />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Your trusted online pharmacy delivering genuine medicines and healthcare products across India.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <FiPhone className="text-primary-400 flex-shrink-0" />
                <span>+91 9999-999-999</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <FiMail className="text-primary-400 flex-shrink-0" />
                <span>support@amitmedical.com</span>
              </div>
              <div className="flex items-start gap-2 text-slate-400">
                <FiMapPin className="text-primary-400 flex-shrink-0 mt-0.5" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'All Products' },
                { to: '/categories', label: 'Categories' },
                { to: '/orders', label: 'My Orders' },
                { to: '/profile', label: 'My Account' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-slate-400 hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              {['Medicines', 'Vitamins & Supplements', 'Personal Care', 'Baby Care', 'Ayurveda', 'Medical Devices'].map(cat => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${cat.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-slate-400 hover:text-primary-400 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info & Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Information</h3>
            <ul className="space-y-2 text-sm mb-6">
              {['About Us', 'Privacy Policy', 'Terms & Conditions', 'Return Policy', 'FAQs', 'Contact Us'].map(item => (
                <li key={item}>
                  <Link to="#" className="text-slate-400 hover:text-primary-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>

            <h3 className="text-white font-semibold mb-3">Follow Us</h3>
            <div className="flex gap-3">
              {[
                { icon: FiFacebook, href: '#', label: 'Facebook' },
                { icon: FiTwitter, href: '#', label: 'Twitter' },
                { icon: FiInstagram, href: '#', label: 'Instagram' },
                { icon: FiYoutube, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-slate-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="text-slate-300 text-sm" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500">Secure Payments:</span>
              {['UPI', 'Visa', 'Mastercard', 'NetBanking', 'COD'].map(method => (
                <span key={method} className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded font-medium">
                  {method}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500 text-center">
              © {currentYear} Amit R. Medical. All rights reserved. | Licensed Online Pharmacy
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
