import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import AppRoutes from './routes/AppRoutes';
import { loadUser } from './redux/slices/authSlice';
import { fetchCart } from './redux/slices/cartSlice';
import StoreLocatorModal from './components/store/StoreLocatorModal';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loadUser());
      dispatch(fetchCart());
    }
  }, [dispatch]);

  return (
    <>
      <AnimatePresence mode="wait">
        <AppRoutes />
      </AnimatePresence>
      {/* Global Store Locator Modal  accessible from anywhere */}
      <StoreLocatorModal />
    </>
  );
}

export default App;
