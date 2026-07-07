import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { trackEvent } from '../utils/analytics';

interface ShopProps {
  onQuickView: (product: Product) => void;
}

export const Shop: React.FC<ShopProps> = ({ onQuickView }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Load active filters from URL parameters
  const activeCategoryParam = searchParams.get('category') || '';
  const activeConcernParam = searchParams.get('concern') || '';
  const activeSkinTypeParam = searchParams.get('skinType') || '';
  const searchStringParam = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(searchStringParam);
  const [selectedCategory, setSelectedCategory] = useState(activeCategoryParam);
  const [selectedConcern, setSelectedConcern] = useState(activeConcernParam);
  const [selectedSkinType, setSelectedSkinType] = useState(activeSkinTypeParam);
  const [sortBy, setSortBy] = useState('popular');
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Update states if URL parameters change
  useEffect(() => {
    setSearchQuery(searchStringParam);
    setSelectedCategory(activeCategoryParam);
    setSelectedConcern(activeConcernParam);
    setSelectedSkinType(activeSkinTypeParam);
  }, [activeCategoryParam, activeConcernParam, activeSkinTypeParam, searchStringParam]);

  // Load recently viewed from localStorage
  useEffect(() => {
    const list = localStorage.getItem('auraskin_recent');
    if (list) {
      const ids: string[] = JSON.parse(list);
      const recentProducts = ids
        .map(id => products.find(p => p.id === id))
        .filter((p): p is Product => !!p)
        .slice(0, 4);
      setRecentlyViewed(recentProducts);
    }
  }, []);

  const handleFilterChange = (type: 'category' | 'concern' | 'skinType', val: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (type === 'category') {
      setSelectedCategory(val);
      if (val) params.set('category', val);
      else params.delete('category');
    } else if (type === 'concern') {
      setSelectedConcern(val);
      if (val) params.set('concern', val);
      else params.delete('concern');
    } else if (type === 'skinType') {
      setSelectedSkinType(val);
      if (val) params.set('skinType', val);
      else params.delete('skinType');
    }

    setSearchParams(params);

    trackEvent({
      name: 'cta_click',
      params: { cta_label: `Filter - ${type}:${val || 'All'}`, section_name: 'Shop Filter Bar' }
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
      trackEvent({ name: 'search', params: { search_term: searchQuery.trim() } });
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedConcern('');
    setSelectedSkinType('');
    setSortBy('popular');
    setSearchParams({});
    trackEvent({ name: 'cta_click', params: { cta_label: 'Clear All Filters', section_name: 'Shop Filter Bar' } });
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query matching name, category, or description
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Category match
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Skin concern match
    if (selectedConcern) {
      result = result.filter(p => p.concern.includes(selectedConcern));
    }

    // Skin type match
    if (selectedSkinType) {
      result = result.filter(p => p.skinType.includes(selectedSkinType) || p.skinType.includes("All"));
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => {
        const ap = a.price - (a.price * a.discount) / 100;
        const bp = b.price - (b.price * b.discount) / 100;
        return ap - bp;
      });
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => {
        const ap = a.price - (a.price * a.discount) / 100;
        const bp = b.price - (b.price * b.discount) / 100;
        return bp - ap;
      });
    } else if (sortBy === 'rated') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'bestseller') {
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    return result;
  }, [searchQuery, selectedCategory, selectedConcern, selectedSkinType, sortBy]);

  // Dynamic filter values
  const categoriesList = Array.from(new Set(products.map(p => p.category)));
  const concernsList = ["Acne", "Aging", "Dullness", "Dryness", "Dark Spots"];
  const skinTypesList = ["Dry", "Oily", "Sensitive", "Combination", "Normal"];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12">
      {/* Editorial Header */}
      <div className="text-center space-y-3">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold font-sans">Curated Index</span>
        <h1 className="text-4xl font-serif text-[#222222]">The Formulation Library</h1>
        <p className="text-sm text-[#222222]/60 font-sans font-light max-w-lg mx-auto">
          Explore our index of high-potency serums, gentle botanical milks, and rich barrier creams designed to target your skin's biological needs.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="border border-[#E8DEC9]/30 bg-[#FFF8F2]/30 rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-[#E8DEC9] pb-2">
            <input 
              type="text" 
              placeholder="Search library..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm placeholder-[#222222]/40 text-[#222222] font-sans font-light"
            />
            <button type="submit" className="text-[#222222]/60 hover:text-[#D4AF37] p-1">
              <Search size={16} />
            </button>
          </form>

          {/* Sorting */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#222222]/60 font-sans">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                trackEvent({ name: 'cta_click', params: { cta_label: `Sort - ${e.target.value}`, section_name: 'Shop Filter Bar' } });
              }}
              className="bg-transparent text-xs font-semibold text-[#222222] outline-none font-sans cursor-pointer"
            >
              <option value="popular">Popularity</option>
              <option value="bestseller">Best Sellers First</option>
              <option value="rated">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div className="lg:col-span-2 flex justify-end">
            {(selectedCategory || selectedConcern || selectedSkinType || searchQuery) && (
              <button 
                onClick={clearAllFilters}
                className="flex items-center space-x-1.5 text-xs text-[#D4AF37] hover:text-[#222222] font-semibold uppercase tracking-wider transition-colors"
              >
                <RotateCcw size={12} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#E8DEC9]/20 text-xs">
          {/* Categories */}
          <div className="space-y-2">
            <label className="text-[#222222]/50 uppercase tracking-widest font-semibold font-sans">Category</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#E8DEC9]/50 rounded-lg p-2.5 outline-none font-sans text-[#222222]"
            >
              <option value="">All Categories</option>
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Skin Concern */}
          <div className="space-y-2">
            <label className="text-[#222222]/50 uppercase tracking-widest font-semibold font-sans">Skin Concern</label>
            <select 
              value={selectedConcern} 
              onChange={(e) => handleFilterChange('concern', e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#E8DEC9]/50 rounded-lg p-2.5 outline-none font-sans text-[#222222]"
            >
              <option value="">All Concerns</option>
              {concernsList.map(concern => (
                <option key={concern} value={concern}>{concern}</option>
              ))}
            </select>
          </div>

          {/* Skin Type */}
          <div className="space-y-2">
            <label className="text-[#222222]/50 uppercase tracking-widest font-semibold font-sans">Skin Type</label>
            <select 
              value={selectedSkinType} 
              onChange={(e) => handleFilterChange('skinType', e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#E8DEC9]/50 rounded-lg p-2.5 outline-none font-sans text-[#222222]"
            >
              <option value="">All Skin Types</option>
              {skinTypesList.map(type => (
                <option key={type} value={type}>{type} Skin</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onQuickView={onQuickView} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4">
          <SlidersHorizontal size={36} className="mx-auto text-[#222222]/30" />
          <h3 className="text-xl font-serif text-[#222222]">No matching formulations found</h3>
          <p className="text-xs text-[#222222]/60 font-sans max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to explore other options.
          </p>
          <button 
            onClick={clearAllFilters}
            className="bg-[#222222] text-[#FAF9F6] px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Recently Viewed Panel */}
      {recentlyViewed.length > 0 && (
        <section className="border-t border-[#E8DEC9]/20 pt-16 space-y-8">
          <h3 className="text-lg font-serif text-[#222222] text-center">Recently Viewed Formulas</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewed.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={onQuickView} 
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
