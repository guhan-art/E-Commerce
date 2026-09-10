import React, { useState } from 'react';
import { ProductReview } from '../../types';
import { StarRating } from '../common/StarRating';
import { Modal } from '../common/Modal';
import { useToastStore } from '../../store/useToastStore';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';
import { ThumbsUp, CheckCircle, PlusCircle, Filter } from 'lucide-react';

interface ReviewSectionProps {
  productId: string;
  reviews: ProductReview[];
  rating: number;
  reviewCount: number;
  onReviewAdded: (newReview: ProductReview) => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  reviews,
  rating,
  reviewCount,
  onReviewAdded,
}) => {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  // Review Form State
  const [formRating, setFormRating] = useState(5);
  const [formName, setFormName] = useState(user?.name || '');
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Thumbs up tracking in local state
  const [helpfulSet, setHelpfulSet] = useState<Record<string, boolean>>({});

  // Compute breakdown percentages
  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
    return { stars, count, pct };
  });

  const filteredReviews = filterRating
    ? reviews.filter((r) => r.rating === filterRating)
    : reviews;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formComment || !formName) return;

    setSubmitting(true);
    try {
      const created = await api.addReview(productId, {
        userName: formName,
        rating: formRating,
        title: formTitle,
        comment: formComment,
        userAvatar: user?.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${formName}`,
      });

      onReviewAdded(created);
      addToast({
        title: 'Review Published',
        description: 'Thank you for sharing your experience with the community.',
        type: 'success',
      });

      setWriteModalOpen(false);
      setFormTitle('');
      setFormComment('');
    } catch {
      addToast({
        title: 'Error',
        description: 'Failed to post review. Please try again.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleHelpful = (reviewId: string) => {
    setHelpfulSet((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  return (
    <div className="pt-12 mt-12 border-t border-zinc-200 dark:border-zinc-800 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
            Customer Reviews & Ratings
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Real feedback from verified acoustic enthusiasts and studio creators
          </p>
        </div>

        <button
          onClick={() => setWriteModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center gap-2 self-start md:self-auto shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80">
        {/* Overall Score */}
        <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
          <span className="text-5xl font-black text-zinc-900 dark:text-zinc-100 font-display">
            {rating.toFixed(1)}
          </span>
          <div className="mt-2">
            <StarRating rating={rating} size="lg" />
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
            Based on {reviewCount} authenticated reviews
          </span>
        </div>

        {/* Breakdown Bars */}
        <div className="md:col-span-2 space-y-2.5 justify-center flex flex-col">
          {ratingCounts.map(({ stars, count, pct }) => (
            <button
              key={stars}
              onClick={() => setFilterRating(filterRating === stars ? null : stars)}
              className={`flex items-center gap-3 w-full text-xs group text-left py-0.5 px-2 rounded-lg transition-colors ${
                filterRating === stars ? 'bg-amber-50 dark:bg-amber-950/40' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
              }`}
            >
              <span className="w-12 text-zinc-600 dark:text-zinc-400 font-semibold group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
                {stars} Stars
              </span>
              <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-10 text-right text-zinc-400 text-[11px]">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Pill if active */}
      {filterRating && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">Showing only {filterRating}-star reviews:</span>
          <button
            onClick={() => setFilterRating(null)}
            className="px-2.5 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 flex items-center gap-1 font-semibold"
          >
            <span>Clear Filter</span>
            <span>×</span>
          </button>
        </div>
      )}

      {/* Review Cards List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-8">
            No reviews match your selected filter.
          </p>
        ) : (
          filteredReviews.map((rev) => {
            const isHelpful = helpfulSet[rev.id];
            const currentHelpful = rev.helpfulCount + (isHelpful ? 1 : 0);

            return (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        rev.userAvatar ||
                        `https://api.dicebear.com/7.x/micah/svg?seed=${rev.userName}`
                      }
                      alt={rev.userName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-800"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                          {rev.userName}
                        </h4>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle className="w-3 h-3" />
                            Verified Studio Buyer
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating rating={rev.rating} size="sm" />
                        <span className="text-[11px] text-zinc-400">• {rev.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
                    {rev.title}
                  </h5>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-zinc-400">
                  <button
                    onClick={() => toggleHelpful(rev.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-colors ${
                      isHelpful
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({currentHelpful})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Write a Review Modal */}
      <Modal isOpen={writeModalOpen} onClose={() => setWriteModalOpen(false)} title="Write an Authenticated Review">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Overall Rating
            </label>
            <StarRating
              rating={formRating}
              interactive
              size="lg"
              onRatingChange={(r) => setFormRating(r)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Guhan Raj"
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Headline
            </label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Sublime soundstage and unmatched build"
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
              Detailed Experience
            </label>
            <textarea
              required
              rows={4}
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              placeholder="What stood out to you? How is the comfort, craftsmanship, or acoustic response?"
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50"
          >
            {submitting ? 'Submitting Review...' : 'Post Review'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
