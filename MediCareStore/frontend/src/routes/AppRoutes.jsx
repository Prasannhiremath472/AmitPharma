import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Pages
import HomePage from '../pages/Home';
import ProductsPage from '../pages/Products';
import ProductDetailsPage from '../pages/ProductDetails';
import CategoriesPage from '../pages/Categories';
import CartPage from '../pages/Cart';
import CheckoutPage from '../pages/Checkout';
import OrdersPage from '../pages/Orders';
import OrderDetailsPage from '../pages/Orders/OrderDetails';
import ProfilePage from '../pages/Profile';
import LoginPage from '../pages/Auth/Login';
import RegisterPage from '../pages/Auth/Register';
import OTPVerifyPage from '../pages/Auth/OTPVerify';
import ForgotPasswordPage from '../pages/Auth/ForgotPassword';
import ResetPasswordPage from '../pages/Auth/ResetPassword';
import NotFoundPage from '../pages/NotFound';

// Admin Pages
import AdminDashboard from '../pages/Admin/Dashboard';
import AdminProducts from '../pages/Admin/Products';
import AdminAddProduct from '../pages/Admin/AddProduct';
import AdminEditProduct from '../pages/Admin/EditProduct';
import AdminCategories from '../pages/Admin/Categories';
import AdminOrders from '../pages/Admin/Orders';
import AdminUsers from '../pages/Admin/Users';
import AdminCoupons from '../pages/Admin/Coupons';
import AdminReviews from '../pages/Admin/Reviews';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-otp" element={<OTPVerifyPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:orderId" element={<OrderDetailsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/add" element={<AdminAddProduct />} />
        <Route path="products/edit/:id" element={<AdminEditProduct />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="reviews" element={<AdminReviews />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
