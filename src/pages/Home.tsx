import React from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/shop/ProductCard';
import { Sparkles, ArrowRight, Award, CheckCircle2, Zap, Palette, Cpu, HeartHandshake } from 'lucide-react';
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

  const categoryAccents: Record<string, string> = {
    Audio: 'from-violet-600 via-purple-600 to-indigo-600',
    Workspace: 'from-pink-500 via-rose-500 to-amber-500',
    Wearables: 'from-cyan-500 via-teal-500 to-emerald-500',
    Lifestyle: 'from-amber-500 via-orange-500 to-rose-500',
    Optics: 'from-blue-600 via-indigo-600 to-violet-600',
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Radiant Colorful Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Playful Ambient Multi-Color Glows */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[350px] bg-gradient-to-tr from-violet-400/25 to-pink-400/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-20 right-1/4 w-[450px] h-[320px] bg-gradient-to-tr from-amber-300/30 to-cyan-300/25 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Chromatic Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-100 via-pink-100 to-amber-100 border border-violet-200 text-xs font-black text-violet-800 shadow-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span>FULL-STACK WEB DEVELOPMENT // CHROMALUX COLLECTION</span>
          </motion.div>

          {/* Bold Colorful Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight font-display max-w-4xl mx-auto leading-[1.08] text-slate-900"
          >
            Chromatic Mastery & <br />
            <span className="bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
              Vibrant Studio Artifacts
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mt-6 leading-relaxed font-medium"
          >
            Precision planar drivers, tactile mechanical switches, and high-saturation designer lifestyle tools engineered for innovators who love bold, expressive aesthetics.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-extrabold text-sm transition-all shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2 group"
            >
              <span>Explore Vivid Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/shop?category=Audio"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border-2 border-violet-200 text-violet-700 font-extrabold text-sm hover:bg-violet-50 transition-colors shadow-sm"
            >
              Acoustic Pulse Gear
            </Link>
          </motion.div>

          {/* Quick Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-14 text-xs font-bold text-slate-700">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free Global Priority Express $150+
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-violet-500" /> 30-Day In-Studio Trial
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-pink-500" /> 2-Year Studio Warranty
            </span>
          </div>
        </div>
      </section>

      {/* Featured Collection Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-violet-600 bg-violet-100 px-3 py-1 rounded-full border border-violet-200 inline-block mb-1">
              Curated Highlights
            </span>
            <h2 className="text-3xl font-black text-slate-900 font-display mt-1">
              Featured Studio Editions
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-extrabold text-violet-700 hover:text-pink-600 flex items-center gap-1.5 transition-colors group"
          >
            <span>View all 12 editions</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Category Showcase Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-pink-600 bg-pink-100 px-3 py-1 rounded-full border border-pink-200 inline-block mb-1">
            Visual Spectrum
          </span>
          <h2 className="text-3xl font-black text-slate-900 font-display mt-1">
            Browse by Discipline
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
            <Link
              key={cat}
              to={`/shop?category=${cat}`}
              className="group relative h-80 rounded-3xl overflow-hidden border-2 border-white shadow-lg hover:shadow-2xl transition-all duration-300 block transform hover:-translate-y-1.5"
            >
              <img
                src={categoryImages[cat]}
                alt={cat}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                  Edition
                </span>
                <h3 className="text-xl font-black font-display mt-0.5">{cat}</h3>
                <span className="text-xs text-pink-300 font-bold flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore Collection <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Vibrant High-Energy Craftsmanship Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-violet-700 via-purple-700 to-pink-600 text-white p-8 sm:p-12 lg:p-16 shadow-2xl shadow-violet-500/25 border-4 border-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-amber-300 text-xs font-black border border-white/20">
              <Award className="w-4 h-4" />
              <span>Full-Stack Engineering & Material Craft</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black font-display leading-tight">
              Machined Aerospace 6063 Aluminum & Saturated Pigment Science
            </h2>

            <p className="text-sm sm:text-base text-pink-100 leading-relaxed font-medium">
              We reject sterile boring tech. Every CHROMALUX artifact is built with tactile switches, high-saturation anodization, and restorative materials engineered for creative coders and designers.
            </p>

            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-400/30"
              >
                <span>Experience The Colorways</span>
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
            <span className="text-xs font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 inline-block mb-1">
              Bestsellers
            </span>
            <h2 className="text-3xl font-black text-slate-900 font-display mt-1">
              Beloved Creator Favorites
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-extrabold text-violet-700 hover:text-pink-600 flex items-center gap-1.5 transition-colors group"
          >
            <span>See entire catalogue</span>
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
