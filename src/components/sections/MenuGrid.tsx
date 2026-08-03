'use client';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuCard } from '../ui/MenuCard';
import { CartItem, MenuItem } from '@/types';

interface MenuGridProps {
  cart: CartItem[];
  items: MenuItem[];
  onIncrease: (id: string, portion: string) => void;
  onDecrease: (id: string, portion: string) => void;
  onAdd: (item: Omit<CartItem, 'qty'>) => void;
}

export function MenuGrid({ cart, items, onIncrease, onDecrease, onAdd }: MenuGridProps) {
  const uniqueCategories = Array.from(new Set(items.map(item => item.category)));
  const categories = ["All", ...uniqueCategories];
  const [activeCategory, setActiveCategory] = useState("All");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section id="menu" className="w-full max-w-7xl mx-auto py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-[#0A0A0B]">
      <h3 className="text-3xl sm:text-4xl font-serif text-white text-center mb-8 sm:mb-12">The Royal Selection</h3>

      {/* ── Category Filter Bar (Scrollable on mobile) ── */}
      <div className="relative flex items-center mb-12 sm:mb-16 px-2 md:px-12">
        <button
          onClick={scrollLeft}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-[60%] z-10 items-center justify-center w-10 h-10 bg-[#161618] text-white rounded-full shadow-lg border border-neutral-800 hover:border-[#DFB15B] hover:text-[#DFB15B] transition-all"
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto overflow-y-hidden whitespace-nowrap gap-3 sm:gap-4 pb-4 max-w-full justify-start px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-1"
        >
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 shrink-0 ${
              activeCategory === cat
                ? 'bg-[#DFB15B] text-black shadow-[0_0_20px_rgba(223,177,91,0.3)]'
                : 'bg-[#161618] text-neutral-400 hover:text-white hover:bg-neutral-800 border border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
        </div>

        <button
          onClick={scrollRight}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-[60%] z-10 items-center justify-center w-10 h-10 bg-[#161618] text-white rounded-full shadow-lg border border-neutral-800 hover:border-[#DFB15B] hover:text-[#DFB15B] transition-all"
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ── Menu Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 xl:gap-10">
        <AnimatePresence mode="popLayout">
          {items
            .filter(item => activeCategory === "All" || item.category === activeCategory)
            .map((item, idx) => {
              const cartItemsForItem = cart.filter(i => i.id === item.id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4, delay: idx * 0.02 }}
                >
                  <MenuCard
                    item={item}
                    cartItems={cartItemsForItem}
                    onIncrease={onIncrease}
                    onDecrease={onDecrease}
                    onAdd={onAdd}
                  />
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>
    </section>
  );
}
