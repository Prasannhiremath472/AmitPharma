import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiUser, FiThumbsUp } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { formatDate, getInitials } from '../../utils/helpers';

const StarRating = ({ value, onChange, readonly = false }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`text-2xl transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <FiStar className={`${(hovered || value) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
        </button>
      ))}
    </div>
  );
};

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 5, title: '', comment: '' });
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/product/${productId}`);
      setReviews(res.data.data);
      setStats(res.data.stats);
    } catch (err) {
      console.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!form.rating) return toast.error('Please select a rating');
    setSubmitting(true);
    try {
      await api.post('/reviews', { ...form, product_id: productId });
      toast.success('Review submitted! It will appear after approval.');
      setShowForm(false);
      setForm({ rating: 5, title: '', comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Stats */}
      {stats && (
        <div className="bg-slate-50 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-slate-800">{parseFloat(stats.avg_rating).toFixed(1)}</div>
              <StarRating value={Math.round(stats.avg_rating)} readonly />
              <p className="text-sm text-slate-500 mt-1">{stats.total} reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map(star => {
                const count = stats[`${['zero', 'one', 'two', 'three', 'four', 'five'][star]}_star`] || 0;
                const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500 w-4">{star}</span>
                    <FiStar className="text-yellow-400 fill-yellow-400 text-xs" />
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-slate-400 w-6 text-xs text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Write Review */}
      {isAuthenticated && (
        <div className="mb-6">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="btn-secondary text-sm"
            >
               Write a Review
            </button>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmitReview}
              className="bg-white border border-slate-200 rounded-2xl p-6"
            >
              <h3 className="font-bold text-slate-800 mb-4">Write Your Review</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 mb-2">Your Rating *</label>
                <StarRating value={form.rating} onChange={(r) => setForm(prev => ({ ...prev, rating: r }))} />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Review Title (optional)"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="input-field text-sm"
                />
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Share your experience with this product..."
                  value={form.comment}
                  onChange={(e) => setForm(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="input-field text-sm resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={submitting} className="btn-primary text-sm">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-sm">
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </div>
      )}

      {/* Review List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-100 rounded-xl h-24" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <FiStar className="text-4xl mx-auto mb-3 opacity-30" />
          <p>No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-100 rounded-xl p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    {review.user_avatar ? (
                      <img src={review.user_avatar} alt={review.user_name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-primary-700 font-bold text-sm">{getInitials(review.user_name)}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{review.user_name}</p>
                    <p className="text-xs text-slate-400">{formatDate(review.created_at)}</p>
                  </div>
                </div>
                <StarRating value={review.rating} readonly />
              </div>
              {review.title && <p className="font-semibold text-slate-700 text-sm mt-3">{review.title}</p>}
              {review.comment && <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">{review.comment}</p>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
