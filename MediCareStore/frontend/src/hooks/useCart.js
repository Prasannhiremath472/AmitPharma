import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import {
  addToCart as addToCartAction,
  updateCartItem as updateCartItemAction,
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
  toggleCartSidebar,
  openCartSidebar,
  closeCartSidebar,
} from '../redux/slices/cartSlice';

const useCart = () => {
  const dispatch = useDispatch();
  const { items, totals, itemCount, isOpen, loading } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);

  const addToCart = async (product_id, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return { success: false };
    }

    const result = await dispatch(addToCartAction({ product_id, quantity }));
    if (addToCartAction.fulfilled.match(result)) {
      toast.success('Added to cart!');
      dispatch(openCartSidebar());
      return { success: true };
    }
    toast.error(result.payload || 'Failed to add to cart');
    return { success: false };
  };

  const updateQuantity = async (productId, quantity) => {
    const result = await dispatch(updateCartItemAction({ productId, quantity }));
    if (!updateCartItemAction.fulfilled.match(result)) {
      toast.error(result.payload || 'Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    const result = await dispatch(removeFromCartAction(productId));
    if (removeFromCartAction.fulfilled.match(result)) {
      toast.success('Item removed from cart');
    } else {
      toast.error(result.payload || 'Failed to remove item');
    }
  };

  const clearAllCart = async () => {
    await dispatch(clearCartAction());
  };

  const isInCart = (productId) => items.some(item => item.product_id === productId);

  const getItemQuantity = (productId) => {
    const item = items.find(i => i.product_id === productId);
    return item?.quantity || 0;
  };

  return {
    items,
    totals,
    itemCount,
    isOpen,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearAllCart,
    isInCart,
    getItemQuantity,
    toggleCartSidebar: () => dispatch(toggleCartSidebar()),
    openCartSidebar: () => dispatch(openCartSidebar()),
    closeCartSidebar: () => dispatch(closeCartSidebar()),
  };
};

export default useCart;
