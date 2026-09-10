import React from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/shop/ProductCard';
import { Badge } from '../components/common/Badge';
import { Sparkles, ArrowRight, Shield, Award, Cpu, Compass, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
  const featuredProducts = INITIAL_PRODUCTS.filter((p) => p.featured).slice(0, 6);
  const bestSellers = INITIAL_PRODUCTS.filter((p) => p.badge === 'Best Seller').slice(0, 4);

  const categoryImages: Record<string, string> = {
    Audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    Workspace: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80',
    Wearables: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    Lifestyle: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    Optics: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-zinc-200/70 dark:border-zinc-800/70">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/15 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Summer 2025 Studio Collection Drop</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight font-display max-w-4xl mx-auto leading-[1.08]"
          >
            Acoustic Mastery & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400">
              Workspace Artifacts
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mt-6 leading-relaxed"
          >
            Precision planar drivers, tactile machined instruments, and minimal objects engineered for makers who value deliberate craft over mass production.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-xl shadow-zinc-950/10 flex items-center justify-center gap-2 group"
            >
              <span>Explore Entire Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/shop?category=Audio"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Listen to AURA Acoustics
            </Link>
          </motion.div>

          {/* Quick value badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-14 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free Worldwide Priority Delivery $150+
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 30-Day In-Studio Trial
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 2-Year Precision Warranty
            </span>
          </div>
        </div>
      </section>

      {/* Featured Collection Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Curated Highlights
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display mt-1">
              Featured Studio Instruments
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-500 flex items-center gap-1.5 transition-colors group"
          >
            <span>View all 12 editions</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Category Showcase Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Curated Spaces
          </span>
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display mt-1">
            Browse by Discipline
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
            <Link
              key={cat}
              to={`/shop?category=${cat}`}
              className="group relative h-72 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md block"
            >
              <img
                src={categoryImages[cat]}
                alt={cat}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Collection
                </span>
                <h3 className="text-lg font-bold font-display mt-0.5">{cat}</h3>
                <span className="text-xs text-zinc-300 flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Discover <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Craft Ethos Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-zinc-900 text-white p-8 sm:p-12 lg:p-16 border border-zinc-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>Uncompromising Material Integrity</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
              Machined from Aerospace 6063 Aluminum & Full-Grain Italian Leathers
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              We never cut corners with molded plastics that end up in landfills. Every AURA artifact is balanced, serviceable, and designed to gain natural character over decades of everyday utility.
            </p>

            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20"
              >
                <span>Explore The Craftsmanship</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Community Favorites
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display mt-1">
              Most Acclaimed Best Sellers
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-500 flex items-center gap-1.5 transition-colors group"
          >
            <span>See full catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
