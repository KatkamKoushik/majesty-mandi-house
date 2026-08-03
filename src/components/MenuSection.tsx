"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";

const menuItems = [
  { id: "1", name: "Chicken Juicy Mandi", price: 350, image: "/dishes/chicken_juicy_mandi.png" },
  { id: "2", name: "Mutton Juicy Mandi", price: 450, image: "/dishes/mutton_juicy_mandi.png" },
  { id: "3", name: "Chicken Faham Mandi", price: 380, image: "/dishes/chicken_faham_mandi.png" },
  { id: "4", name: "Fish Platter Mandi", price: 500, image: "/dishes/fish_platter_mandi.png" },
  { id: "5", name: "Chicken Madfoon Mandi", price: 400, image: "/dishes/chicken_madfoon_mandi.png" },
  { id: "6", name: "Chicken Majestic", price: 280, image: "/dishes/chicken_majestic.png" },
  { id: "7", name: "Royal Arabian Mix Mandi", price: 850, image: "" }, // Intentional missing image for skeleton
];

export default function MenuSection() {
  const { addItem } = useCartStore();

  return (
    <section id="menu" className="bg-[#0B0B0C] relative pb-32">
      {/* 1. Standalone Background Banner */}
      <div className="relative w-full h-48 md:h-64 mb-12 flex items-center justify-center overflow-hidden">
        <Image src="/menu/menu-main.jpg" alt="Menu Header" fill className="object-cover opacity-60" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] to-transparent" />
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10 font-serif text-5xl md:text-6xl text-imperial drop-shadow-lg"
        >
          The Royal Selection
        </motion.h2>
      </div>

      {/* 2. Strict CSS Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 max-w-7xl mx-auto">
        {menuItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group"
          >
            {/* 3. Constrained Menu Cards */}
            <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:border-[#DFB15B] transition-colors h-full">
              
              {/* 4. Constrain the Transparent PNGs */}
              <div className="relative w-48 h-48 mb-4 flex items-center justify-center">
                {item.image ? (
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-contain group-hover:scale-110 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 animate-pulse rounded-full flex items-center justify-center">
                    <span className="text-imperial/30 font-serif italic text-sm">Preview Unavailable</span>
                  </div>
                )}
              </div>
              
              {/* 5. Align the UI: Stacked Title, Price, Button */}
              <div className="flex flex-col flex-grow w-full">
                <h3 className="font-serif text-2xl text-white group-hover:text-imperial transition-colors mb-2">
                  {item.name}
                </h3>
                <span className="text-amber font-bold text-xl mb-6 flex-grow">
                  ₹{item.price}
                </span>
                
                <button 
                  onClick={() => addItem(item)}
                  className="w-full py-3 rounded-lg border border-imperial text-imperial font-medium tracking-wide hover:bg-imperial hover:text-[#0B0B0C] hover:shadow-[0_0_20px_rgba(223,177,91,0.4)] transition-all duration-300 mt-auto"
                >
                  ADD TO ORDER
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
