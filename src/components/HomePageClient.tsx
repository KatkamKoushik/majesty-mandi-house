'use client';
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Navbar } from '@/components/layout/Navbar';
import { CanvasHero } from '@/components/layout/CanvasHero';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { MenuGrid } from '@/components/sections/MenuGrid';
import { AmbianceGallery } from '@/components/sections/AmbianceGallery';
import { PhysicalMenuCTA } from '@/components/sections/PhysicalMenuCTA';
import { TableReservation } from '@/components/sections/TableReservation';
import { BirthdayPromoModal } from '@/components/ui/BirthdayPromoModal';
import { CartItem, MenuItem } from '@/types';

export function HomePageClient({ initialMenuItems }: { initialMenuItems: MenuItem[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "menuItems"));
        const items: MenuItem[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          items.push({
            id: doc.id,
            name: data.name,
            description: data.description,
            prices: data.prices || { Regular: 0 },
            category: data.category,
            image: data.image_url,
          } as MenuItem);
        });
        // We might need to sort them or just set them
        setMenuItems(items);
      } catch (error) {
        console.error("Failed to fetch menu from Firebase:", error);
      }
    };
    fetchMenuItems();
  }, []);

  // Cart Functions
  const addToCart = (item: Omit<CartItem, 'qty'>) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id && i.selectedPortion === item.selectedPortion);
      if (exists) return prev.map(i => (i.id === item.id && i.selectedPortion === item.selectedPortion) ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const increaseQty = (id: string, portion: string) => {
    setCart(prev => prev.map(i => (i.id === id && i.selectedPortion === portion) ? { ...i, qty: i.qty + 1 } : i));
  };

  const decreaseQty = (id: string, portion: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id && i.selectedPortion === portion);
      if (existing && existing.qty === 1) {
        return prev.filter(i => !(i.id === id && i.selectedPortion === portion));
      }
      return prev.map(i => 
        (i.id === id && i.selectedPortion === portion) 
          ? { ...i, qty: i.qty - 1 } 
          : i
      );
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <main className="min-h-screen bg-[#0A0A0B] text-white font-sans overflow-clip relative selection:bg-[#DFB15B] selection:text-[#0A0A0B]">
      <div id="home" className="absolute top-0 left-0 w-full h-[1px] pointer-events-none" />
      <BirthdayPromoModal />
      {/* ═══════════════ TOP BANNER ═══════════════ */}
      <div className="w-full bg-gradient-to-r from-[#DFB15B] via-[#F3A833] to-[#DFB15B] text-black text-center py-2.5 font-bold text-xs sm:text-sm tracking-wide z-40 relative shadow-[0_0_20px_rgba(0,0,0,0.8)] border-t-2 border-[#DFB15B]/50">
        🎓 Exclusive Offer: 10% Discount available with a valid Student ID (Dine-in only).
      </div>

      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onIncrease={increaseQty}
        onDecrease={decreaseQty}
      />

      <CanvasHero />

      {/* ═══════════════ THE MAJESTY EXPERIENCE ═══════════════ */}
      <section className="w-full py-20 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 bg-[#0A0A0B]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#DFB15B] text-xs sm:text-sm tracking-[0.4em] uppercase font-bold mb-4">The Legacy</p>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-cinzel text-white mb-8">The Majesty Experience</h3>
          <div className="w-12 h-[2px] bg-[#DFB15B]/50 mx-auto mb-10" />
          
          <p className="text-neutral-400 text-sm sm:text-base md:text-lg leading-relaxed font-light mb-6">
            Majesty Mandi House is a popular dining destination in Hanumakonda that specializes in authentic Arabian-style mandi and traditional Middle Eastern flavors. Known for its fragrant rice, tender meat preparations, and generous portions, the restaurant offers a unique culinary experience for mandi lovers in Greater Warangal.
          </p>
          <p className="text-neutral-400 text-sm sm:text-base md:text-lg leading-relaxed font-light mb-6">
            The restaurant serves a variety of chicken, mutton, and special mandi dishes prepared using aromatic spices and traditional cooking techniques. With its comfortable seating, family-friendly atmosphere, and flavorful menu, Majesty Mandi House has become a preferred choice for families, friends, and food enthusiasts looking to enjoy authentic Arabian cuisine.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-16">
            {["Authentic Arabian Mandi", "Family-Friendly Dining", "Freshly Prepared Food", "Large Sharing Platters"].map((feature, idx) => (
              <span key={idx} className="border border-[#161618] bg-[#161618] text-neutral-300 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-wide">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </section>

      <MenuGrid 
        cart={cart} 
        items={menuItems}
        onIncrease={increaseQty} 
        onDecrease={decreaseQty} 
        onAdd={addToCart} 
      />

      <PhysicalMenuCTA />
      <AmbianceGallery />
      <TableReservation />

      {/* ═══════════════ FOOTER & CONTACT ═══════════════ */}
      <div id="contact" className="w-full">
        {/* Golden Divider Line */}
        <div className="w-full h-[1px] bg-[#C5A059]/40 relative z-30" />
        <footer className="relative overflow-hidden w-full py-14 px-6 sm:px-10 bg-[#0A0A0B]">
          {/* Video Background */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            src="/ambiance/footer-particles.mp4" 
            className="absolute inset-0 w-full h-full object-cover z-0" 
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none" />

          <div className="relative z-20 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            {/* Left Side: Design Credits */}
            <div className="flex flex-col shrink-0">
              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 mb-3 font-sans">
                DESIGNED &amp; DEVELOPED BY
              </span>
              <div className="flex flex-col gap-1">
                <h2 className="font-cinzel text-white text-xl sm:text-2xl uppercase tracking-[0.15em] whitespace-nowrap">KOUSHIK KATKAM</h2>
                <h2 className="font-cinzel text-white text-xl sm:text-2xl uppercase tracking-[0.15em] whitespace-nowrap">VYSHNAVI NAGAVELLI</h2>
              </div>
            </div>

            {/* Right Side: Clickable Contact Links */}
            <div className="grid grid-cols-2 gap-10 md:gap-16 lg:gap-24 text-left md:text-right font-sans">
              {/* Vyshnavi's Column */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col md:items-end">
                  <span className="text-[10px] text-[#C5A059] tracking-widest uppercase mb-1 font-semibold">EMAIL</span>
                  <a href="mailto:nagavellivyshnavi3@gmail.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#C5A059] transition-colors duration-300 text-sm tracking-wide">nagavellivyshnavi3@gmail.com</a>
                </div>
                <div className="flex flex-col md:items-end">
                  <span className="text-[10px] text-[#C5A059] tracking-widest uppercase mb-1 font-semibold">LINKEDIN</span>
                  <a href="https://linkedin.com/in/vyshnavi-nagavelli-135465355/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#C5A059] transition-colors duration-300 text-sm tracking-wide">in/vyshnavi-nagavelli</a>
                </div>
                <div className="flex flex-col md:items-end">
                  <span className="text-[10px] text-[#C5A059] tracking-widest uppercase mb-1 font-semibold">GITHUB</span>
                  <a href="https://github.com/nagavellivyshnavi" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#C5A059] transition-colors duration-300 text-sm tracking-wide">github.com/nagavellivyshnavi</a>
                </div>
              </div>

              {/* Koushik's Column */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col md:items-end">
                  <span className="text-[10px] text-[#C5A059] tracking-widest uppercase mb-1 font-semibold">EMAIL</span>
                  <a href="mailto:koushikkatkam@gmail.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#C5A059] transition-colors duration-300 text-sm tracking-wide">koushikkatkam@gmail.com</a>
                </div>
                <div className="flex flex-col md:items-end">
                  <span className="text-[10px] text-[#C5A059] tracking-widest uppercase mb-1 font-semibold">INSTAGRAM</span>
                  <a href="https://instagram.com/koushik_katkam" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#C5A059] transition-colors duration-300 text-sm tracking-wide">@koushik_katkam</a>
                </div>
                <div className="flex flex-col md:items-end">
                  <span className="text-[10px] text-[#C5A059] tracking-widest uppercase mb-1 font-semibold">LINKEDIN</span>
                  <a href="https://linkedin.com/in/koushik-katkam" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#C5A059] transition-colors duration-300 text-sm tracking-wide">in/koushik-katkam</a>
                </div>
                <div className="flex flex-col md:items-end">
                  <span className="text-[10px] text-[#C5A059] tracking-widest uppercase mb-1 font-semibold">GITHUB</span>
                  <a href="https://github.com/KatkamKoushik" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#C5A059] transition-colors duration-300 text-sm tracking-wide">github.com/KatkamKoushik</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
