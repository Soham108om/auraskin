import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, Heart, ShoppingBag, Send } from 'lucide-react';
import { products } from '../data/products';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ReviewCard } from '../components/ReviewCard';
import { ProductCard } from '../components/ProductCard';
import { trackEvent } from '../utils/analytics';
import { formatRupee, getProductPrice } from '../utils/currency';


interface ProductDetailsProps {
  onQuickView: (product: Product) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ onQuickView }) => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'benefits' | 'shipping'>('details');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedScent, setSelectedScent] = useState('');

  // Review states
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewList, setReviewList] = useState<Review[]>([]);

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(foundProduct.image);
      setReviewList(foundProduct.reviews);
      setQuantity(1);
      setSelectedSize(foundProduct.sizes?.[0] || foundProduct.size);
      setSelectedScent(foundProduct.scents?.[0] || "Signature Blend");

      // Track View Item
      trackEvent({
        name: 'view_item',
        params: {
          item_id: foundProduct.id,
          item_name: foundProduct.name,
          price: foundProduct.price - (foundProduct.price * foundProduct.discount) / 100,
          category: foundProduct.category,
        },
      });

      // Update Recently Viewed in localStorage
      const recentListStr = localStorage.getItem('auraskin_recent');
      let recentList: string[] = recentListStr ? JSON.parse(recentListStr) : [];
      recentList = recentList.filter((item) => item !== foundProduct.id);
      recentList.unshift(foundProduct.id);
      localStorage.setItem('auraskin_recent', JSON.stringify(recentList.slice(0, 8)));
    }
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-4">
        <h2 className="text-2xl font-serif text-[#222222]">Formula Not Found</h2>
        <p className="text-xs text-[#222222]/60 font-sans">The requested skin formula could not be retrieved.</p>
        <Link to="/shop" className="inline-block bg-[#222222] text-[#FAF9F6] text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-full">
          Back to Library
        </Link>
      </div>
    );
  }

  const currentPrice = getProductPrice(product, selectedSize);
  const discountedPrice = currentPrice - (currentPrice * product.discount) / 100;
  const isLiked = isInWishlist(product.id);

  // Dynamic recommendations
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewName.trim() && reviewComment.trim()) {
      const newReview: Review = {
        id: `user_rev_${Date.now()}`,
        user: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        date: new Date().toISOString().split('T')[0],
        verified: true,
      };

      setReviewList((prev) => [newReview, ...prev]);

      trackEvent({
        name: 'cta_click',
        params: {
          cta_label: `Submit Review - Rating ${reviewRating}`,
          section_name: 'Product Reviews Form',
        },
      });

      // Reset
      setReviewName('');
      setReviewComment('');
      setReviewRating(5);
      alert('Thank you for sharing your AuraSkin experience! Your review is now live.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-16">
      {/* 1. Main Specs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#F5EFE6]/30 border border-[#E8DEC9]/20 relative group">
            {/* Simple Zoom Simulation on Hover */}
            <img 
              src={selectedImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-110" 
            />
            {product.discount > 0 && (
              <span className="absolute top-6 left-6 bg-[#D4AF37] text-white text-[10px] font-semibold tracking-widest px-3 py-1 rounded-full uppercase">
                {product.discount}% OFF
              </span>
            )}
          </div>
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto py-1">
              {product.images.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 aspect-square rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-gray-100 ${
                    selectedImage === imgUrl ? 'border-[#D4AF37]' : 'border-[#E8DEC9]/40'
                  }`}
                >
                  <img src={imgUrl} alt={`${product.name} preview ${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Copy Details */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block">{product.category}</span>
              <h1 className="text-3xl md:text-4xl font-serif text-[#222222] mt-1">{product.name}</h1>
            </div>

            {/* Ratings Summary */}
            <div className="flex items-center space-x-3">
              <div className="flex text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(product.rating) ? '#D4AF37' : 'none'} className="mr-0.5" />
                ))}
              </div>
              <span className="text-xs text-[#222222]/50 font-sans">({reviewList.length} customer reviews)</span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline space-x-3 py-2 border-b border-[#E8DEC9]/20 font-sans">
              {product.discount > 0 ? (
                <>
                  <span className="text-2xl font-serif text-[#D4AF37] font-bold">{formatRupee(discountedPrice)}</span>
                  <span className="text-sm line-through text-[#222222]/40">{formatRupee(currentPrice)}</span>
                </>
              ) : (
                <span className="text-2xl font-serif text-[#222222] font-semibold">{formatRupee(currentPrice)}</span>
              )}
            </div>

            <p className="text-sm text-[#222222]/80 leading-relaxed font-sans font-light">
              {product.description}
            </p>

            {/* Interactive Variant Selectors */}
            <div className="space-y-4 pt-2">
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#222222]/50 font-sans font-semibold block">Select Volume</span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => {
                      const szPrice = getProductPrice(product, sz);
                      const extraPrice = szPrice - product.price;
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`px-4 py-2 rounded-full border text-xs font-sans transition-all duration-300 ${
                            selectedSize === sz
                              ? 'border-[#D4AF37] bg-[#FFF8F2] text-[#222222] font-medium shadow-sm'
                              : 'border-[#E8DEC9]/50 text-[#222222]/70 hover:border-[#E8DEC9] bg-transparent'
                          }`}
                        >
                          {sz} {extraPrice > 0 && `(+${formatRupee(extraPrice)})`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {product.scents && product.scents.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#222222]/50 font-sans font-semibold block">Select Scent Blend</span>
                  <div className="flex flex-wrap gap-2">
                    {product.scents.map((sc) => (
                      <button
                        key={sc}
                        type="button"
                        onClick={() => setSelectedScent(sc)}
                        className={`px-4 py-2 rounded-full border text-xs font-sans transition-all duration-300 ${
                          selectedScent === sc
                            ? 'border-[#D4AF37] bg-[#FFF8F2] text-[#222222] font-medium shadow-sm'
                            : 'border-[#E8DEC9]/50 text-[#222222]/70 hover:border-[#E8DEC9] bg-transparent'
                        }`}
                      >
                        {sc}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Specs row */}
            <div className="grid grid-cols-2 gap-4 text-xs font-sans py-4 border-b border-[#E8DEC9]/20">
              <div>
                <span className="text-[#222222]/40 block uppercase tracking-wider">Default Size</span>
                <span className="font-semibold text-[#222222] mt-0.5 block">{product.size}</span>
              </div>
              <div>
                <span className="text-[#222222]/40 block uppercase tracking-wider">Skin Compatibility</span>
                <span className="font-semibold text-[#222222] mt-0.5 block truncate">{product.skinType.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-[#E8DEC9] rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-[#F5EFE6] text-[#222222] transition-colors"
                >
                  -
                </button>
                <span className="px-3 text-sm font-sans font-medium text-[#222222]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-[#F5EFE6] text-[#222222] transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity, selectedSize, selectedScent)}
                className="flex-1 bg-[#222222] hover:bg-[#222222]/90 text-white font-sans text-xs uppercase tracking-[0.2em] font-semibold py-3.5 px-6 rounded-full flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-md"
              >
                <ShoppingBag size={14} />
                <span>Add to Routine</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-full border border-[#E8DEC9] transition-all hover:bg-[#FFF8F2] ${
                  isLiked ? 'text-[#D4AF37] bg-[#FFF8F2]' : 'text-[#222222]/70'
                }`}
              >
                <Heart size={16} fill={isLiked ? '#D4AF37' : 'none'} />
              </button>
            </div>

            <div className="text-[10px] text-[#222222]/50 font-sans flex items-center justify-center space-x-2">
              <ShieldCheck size={12} className="text-[#D4AF37]" />
              <span>Complimentary sample set included with this order.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Editorial Description Tabs */}
      <div className="border-t border-[#E8DEC9]/20 pt-10">
        <div className="flex border-b border-[#E8DEC9]/10 space-x-8 text-xs uppercase tracking-widest font-semibold font-sans">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'details' ? 'border-[#D4AF37] text-[#222222]' : 'border-transparent text-[#222222]/40 hover:text-[#222222]'
            }`}
          >
            The Formula
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'ingredients' ? 'border-[#D4AF37] text-[#222222]' : 'border-transparent text-[#222222]/40 hover:text-[#222222]'
            }`}
          >
            Ingredients Science
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'benefits' ? 'border-[#D4AF37] text-[#222222]' : 'border-transparent text-[#222222]/40 hover:text-[#222222]'
            }`}
          >
            Key Benefits
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'shipping' ? 'border-[#D4AF37] text-[#222222]' : 'border-transparent text-[#222222]/40 hover:text-[#222222]'
            }`}
          >
            Delivery & Ritual Services
          </button>
        </div>

        <div className="py-6 text-sm text-[#222222]/80 leading-relaxed font-sans font-light max-w-3xl">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <p>{product.longDescription}</p>
            </div>
          )}
          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <p>Full breakdown of active components and base compounds:</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {product.ingredients.map((ing, i) => (
                  <span key={i} className="bg-[#F5EFE6] text-[#222222]/80 text-[10px] px-3 py-1 rounded-full font-medium">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'benefits' && (
            <div className="space-y-3">
              <ul className="space-y-2">
                {product.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center space-x-2 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'shipping' && (
            <div className="space-y-2 text-xs">
              <p>• **Standard Delivery**: Complimentary on orders over $50. Arrives in 3–5 business days in our signature FSC-certified ivory shipping boxes.</p>
              <p>• **Skin Concierge Service**: Every package comes with a custom application routines booklet.</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Interactive Review Form & Testimonials list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-[#E8DEC9]/20 pt-12">
        {/* Left Column: Form */}
        <div className="space-y-6">
          <h3 className="text-xl font-serif text-[#222222]">Write a Review</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-[#222222]/60 font-sans font-semibold uppercase tracking-wider">Your Name</label>
              <input
                type="text"
                placeholder="Eleanor Vance"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#E8DEC9] rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#222222]/60 font-sans font-semibold uppercase tracking-wider block">Rating</label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="bg-[#FAF9F6] border border-[#E8DEC9] rounded-xl p-2.5 text-xs font-sans focus:outline-none focus:border-[#D4AF37] cursor-pointer"
              >
                <option value={5}>5 Stars - Outstanding</option>
                <option value={4}>4 Stars - Very Good</option>
                <option value={3}>3 Stars - Average</option>
                <option value={2}>2 Stars - Subpar</option>
                <option value={1}>1 Star - Dissatisfied</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#222222]/60 font-sans font-semibold uppercase tracking-wider">Share your thoughts</label>
              <textarea
                placeholder="How does the product feel? What results did you see?"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="w-full bg-[#FAF9F6] border border-[#E8DEC9] rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#222222] hover:bg-[#222222]/90 text-white font-sans text-xs uppercase tracking-[0.2em] font-semibold py-3 px-4 rounded-full flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-md"
            >
              <span>Submit Review</span>
              <Send size={12} />
            </button>
          </form>
        </div>

        {/* Right Column: Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-serif text-[#222222]">Customer Experiences</h3>
          {reviewList.length > 0 ? (
            <div className="space-y-4">
              {reviewList.map((rev) => (
                <ReviewCard key={rev.id} review={rev} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#222222]/40 font-sans">Be the first to review this formulation.</p>
          )}
        </div>
      </div>

      {/* 4. Related Recommendations */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-[#E8DEC9]/20 pt-12 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold font-sans">Synergistic Pairings</span>
            <h3 className="text-2xl font-serif text-[#222222]">Complete Your Ritual</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
