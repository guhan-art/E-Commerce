import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, FilterState, Category } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/shop/ProductCard';
import { FilterSidebar } from '../components/shop/FilterSidebar';
import { CompareDrawer } from '../components/shop/CompareDrawer';
import { LayoutGrid, List, SlidersHorizontal, RotateCcw, ArrowUpDown } from 'lucide-react';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = (searchParams.get('category') as Category) || 'All';
  const queryParam = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination / Infinite scroll state
  const [paginationMode, setPaginationMode] = useState<'pages' | 'infinite'>('pages');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [visibleCount, setVisibleCount] = useState(6);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: queryParam,
    category: categoryParam,
    minPrice: 0,
    maxPrice: 1000,
    inStockOnly: false,
    minRating: 0,
    sortBy: 'featured',
  });

  // Sync state if URL query params change
  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [categoryParam]);

  // Fetch products through mock API with filters
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api
      .getProducts({
        category: filters.category,
        search: filters.searchQuery,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        inStockOnly: filters.inStockOnly,
        minRating: filters.minRating,
        sortBy: filters.sortBy,
      })
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          setLoading(false);
          setCurrentPage(1); // reset to page 1 on filter change
          setVisibleCount(pageSize);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [filters, pageSize]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'All',
      minPrice: 0,
      maxPrice: 1000,
      inStockOnly: false,
      minRating: 0,
      sortBy: 'featured',
    });
    setSearchParams({});
  };

  // Slice products for active pagination / infinite scroll
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const displayedProducts = useMemo(() => {
    if (paginationMode === 'infinite') {
      return products.slice(0, visibleCount);
    }
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, paginationMode, visibleCount, currentPage, pageSize]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + pageSize, totalItems));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            AURA Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 font-display mt-1">
            {filters.category === 'All' ? 'All Studio Hardware' : `${filters.category} Collection`}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Machined from solid metals, precision calibrated transducers, and ergonomic accessories.
          </p>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold flex items-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-500" />
            <span>Filters</span>
          </button>

          {/* Sort Select */}
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 absolute left-3 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="pl-8 pr-8 py-2 text-xs font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer"
            >
              <option value="featured">Sort: Featured Picks</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="newest">Newest Releases</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden bg-white dark:bg-zinc-800 p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
              title="List View"
              aria-label="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            totalProductsCount={totalItems}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            totalProductsCount={totalItems}
            isMobileDrawer
            onCloseMobile={() => setMobileFilterOpen(false)}
          />
        )}

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-8">
          {/* Active Filter summary strip */}
          {(filters.searchQuery || filters.category !== 'All' || filters.inStockOnly || filters.minRating > 0 || filters.maxPrice < 1000) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">Active filters:</span>
              {filters.searchQuery && (
                <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center gap-1 font-medium">
                  Search: "{filters.searchQuery}"
                </span>
              )}
              {filters.category !== 'All' && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 font-medium">
                  {filters.category}
                </span>
              )}
              {filters.inStockOnly && (
                <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium">
                  In-Stock Only
                </span>
              )}
              {filters.minRating > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-medium">
                  {filters.minRating}★+
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-500 hover:underline font-semibold ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading ? (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 space-y-4 animate-pulse"
                >
                  <div className="aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 pt-2" />
                </div>
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20 p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-200/60 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                <RotateCcw className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                No artifacts matched your criteria
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                Try widening your price range, searching for another keyword, or resetting filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Product List / Grid */
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          )}

          {/* Pagination & Infinite Scroll Mode Selector */}
          {!loading && totalItems > 0 && (
            <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 dark:text-zinc-400">Navigation:</span>
                <button
                  onClick={() => setPaginationMode('pages')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                    paginationMode === 'pages'
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  Numbered Pages
                </button>
                <button
                  onClick={() => setPaginationMode('infinite')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                    paginationMode === 'infinite'
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  Infinite / Load More
                </button>
              </div>

              {/* Numbered Page Controls */}
              {paginationMode === 'pages' ? (
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setCurrentPage(p);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-colors ${
                        currentPage === p
                          ? 'bg-emerald-600 text-white'
                          : 'border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              ) : (
                /* Load More button for infinite scrolling */
                visibleCount < totalItems && (
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
                  >
                    Load More ({totalItems - visibleCount} remaining)
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      <CompareDrawer />
    </div>
  );
};
