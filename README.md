# Majesty Mandi House - Web Application and Showcase

A production-grade, immersive web experience built for Majesty Mandi House, a premier Arabian Mandi restaurant located in Hanamkonda, Warangal, Telangana.

This project delivers a luxury digital presence featuring interactive scroll-driven canvas animations, dynamic menu management, WhatsApp-integrated ordering and table reservations, and an authenticated administrative dashboard.

---

## Project Background

This web application was originally engineered as a commercial product intended for acquisition by the management of Majesty Mandi House to modernize their digital presence, streamline online take-out and delivery orders, and eliminate third-party aggregator commissions.

When the restaurant management declined the proposal, the authors decided to preserve the codebase and publish it as an active, high-performance showcase and engineering portfolio piece.

To make the context clear to visitors, the site features a top notice banner:
`CURRENTLY AVAILABLE FOR SHOWCASE PURPOSES. A CUSTOM WEB EXPERIENCE BUILT BY KOUSHIK & VYSHNAVI.`

All ordering workflows, menu configurations, reservation engines, and administrative interfaces are fully functional and serve as a real-world demonstration of modern web technologies.

---

## Live Demonstration

The production deployment is hosted on Vercel:
https://majesty-mandi-house-eight.vercel.app

---

## Core Capabilities and Architecture

### 1. Scroll-Driven 241-Frame Canvas Hero
- Renders an interactive 241-frame sequence (`frame_0000.webp` to `frame_0240.webp`) bound directly to user scroll position.
- Uses an HTML5 `<canvas>` element managed via a requestAnimationFrame throttle to guarantee consistent 60 FPS playback without DOM re-renders.
- Includes eager image preloading and cache-busting mechanisms to prevent browser asset caching glitches.
- Transitions seamlessly into an interactive hero section displaying rotating signature Mandi platters.

### 2. Dual-Source Dynamic Menu Engine
- Primary data source: Google Cloud Firestore (`menuItems` collection).
- Secondary data source: Structured local fallback in `src/data/menu.ts` to ensure zero downtime during network or quota failures.
- Category filtering: Specials, Chicken Starters, Chicken Mandi, Mutton Mandi, Seafood Mandi, Veg and Egg, Desserts, and Beverages.
- Supports multi-portion pricing models per dish (for example: Single, Half, Full, 1 Piece, 2 Pieces, 4 Pieces, Jumbo).

### 3. WhatsApp Direct Order Dispatch
- Built-in slide-out Cart Drawer (`CartDrawer.tsx`) supporting quantity increments, portion variations, delivery or pickup selection, and delivery address inputs.
- Automatically calculates:
  - Line-item prices based on selected portion size
  - Order subtotal
  - Statutory 5% Goods and Services Tax (GST)
  - Final payable grand total
- Compiles the entire order into an encoded WhatsApp message string and dispatches it directly to the restaurant operations line via `wa.me/919502316909`.

### 4. Table Reservation System
- A dedicated reservation interface (`TableReservation.tsx`) allowing guests to select guest counts, date, time slot, and occasion (birthday, anniversary, family gathering).
- Formulates a structured booking notification sent directly through WhatsApp for immediate confirmation.

### 5. Birthday Promotion Modal
- Automated promotional modal (`BirthdayPromoModal.tsx`) that triggers after initial user engagement.
- Allows diners to register their birth date and claim an exclusive 10% celebration discount via automated WhatsApp verification.

### 6. High-Resolution Physical Menu Viewer
- Dedicated route at `/physical-menu` displaying full-bleed, high-resolution scans of the physical dine-in menu cards for guests who prefer the traditional printed layout.

### 7. Authenticated Administrative Dashboard
- Secure route at `/admin` protected by Clerk Authentication (`@clerk/nextjs`).
- Complete CRUD operations on Firestore `menuItems`:
  - Create new dishes with multiple portion prices
  - Update dish names, descriptions, pricing structures, and categories
  - Upload dish imagery directly to Cloudinary using `CldUploadWidget`
  - Remove deprecated dishes with real-time UI synchronization
- Custom login route at `/admin/login` styled to match the dark luxury aesthetic.

### 8. Ambient Video Layering
- Seamless looping video backgrounds embedded in the top announcement banner (`gold-particles.mp4`) and the footer section (`footer-particles.mp4`).
- Optimized with `autoPlay`, `loop`, `muted`, `playsInline`, and `preload="auto"` attributes.
- Configured in Next.js middleware (`src/proxy.ts`) to bypass authentication checks and allow direct CDN caching and streaming.

---

## Technical Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| UI Library | React 19 |
| Styling | Tailwind CSS, CSS Variables |
| Animation | Framer Motion |
| Icons | Lucide React |
| Authentication | Clerk (`@clerk/nextjs`) |
| Database | Google Cloud Firestore (Firebase Web SDK) |
| Media Storage | Cloudinary (`next-cloudinary`) |
| State Management | Zustand, React State |
| Deployment | Vercel |

---

## Project Structure

```
majesty-mandi-house/
├── public/
│   ├── ambiance/             # Looping background video files (.mp4) and venue photography
│   ├── brand/                # Restaurant logos and identity assets
│   ├── dishes/               # Transparent and high-res dish photography
│   ├── menu/                 # Scanned pages of the physical dine-in menu
│   └── webp_frames/          # 241 frames for the scroll-bound canvas animation
├── src/
│   ├── app/
│   │   ├── admin/            # Authenticated admin dashboard and login routes
│   │   │   ├── login/        # Clerk login interface
│   │   │   └── page.tsx      # Dish editor and Firestore management table
│   │   ├── physical-menu/    # Traditional menu card viewer page
│   │   ├── globals.css       # Tailwind directives and custom luxury scrollbar styling
│   │   ├── layout.tsx        # Root layout with font imports, ClerkProvider, and top banner
│   │   └── page.tsx          # Homepage entry point
│   ├── components/
│   │   ├── layout/           # CanvasHero, Navbar, CartDrawer
│   │   ├── sections/         # MenuGrid, AmbianceGallery, PhysicalMenuCTA, TableReservation
│   │   ├── ui/               # BirthdayPromoModal
│   │   └── HomePageClient.tsx # Client-side orchestrator (cart state, Firebase sync)
│   ├── data/
│   │   └── menu.ts           # Fallback static menu records
│   ├── lib/
│   │   └── firebase.ts       # Firebase app, Firestore, and Storage initialization
│   ├── proxy.ts              # Next.js route protection and static media matcher
│   └── types/
│       └── index.ts          # Core TypeScript models (MenuItem, CartItem)
├── migrate.mjs               # Node.js script to seed static menu data into Firestore
├── package.json
└── tailwind.config.js
```

---

## Environment Configuration

Create a `.env.local` file in the root directory and configure the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/admin/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/admin/login
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin

# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-...

# Cloudinary (Admin Image Uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

## Installation and Local Development

### Prerequisites
- Node.js 18.18 or higher
- PNPM (recommended), NPM, or Yarn

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/KatkamKoushik/majesty-mandi-house.git
   cd majesty-mandi-house
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Populate environment variables:
   Copy `.env.example` to `.env.local` and add your Firebase, Clerk, and Cloudinary keys.

4. Optional - Seed the Firestore Database:
   If your Firestore database is empty, seed it with the default restaurant menu records:
   ```bash
   node migrate.mjs
   ```

5. Run the local development server:
   ```bash
   pnpm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Building for Production

To create an optimized production build:

```bash
pnpm run build
```

To test the production build locally:

```bash
pnpm run start
```

---

## Design and Typography Details

The visual system adopts a regal Middle Eastern luxury aesthetic:
- Primary Background: `#0A0A0B` / `#0B0B0C` (deep obsidian black)
- Primary Accent: `#DFB15B` and `#C5A059` (warm imperial gold)
- Accent Gradients: `#DFB15B` to `#F3A833`
- Typography:
  - `Cinzel`: Classical serif used for prestige headings and branding
  - `Playfair Display`: High-contrast editorial display font
  - `Montserrat`: Geometric sans-serif for sub-headings, badges, and uppercase labels
  - `Inter`: Highly legible neutral sans-serif for body descriptions and tabular prices

---

## Creators and Credits

Designed and developed by:

- Koushik Katkam
  - Email: koushikkatkam@gmail.com
  - LinkedIn: https://linkedin.com/in/koushik-katkam
  - GitHub: https://github.com/KatkamKoushik
  - Instagram: https://instagram.com/koushik_katkam

- Vyshnavi Nagavelli
  - Email: nagavellivyshnavi3@gmail.com
  - LinkedIn: https://linkedin.com/in/vyshnavi-nagavelli-135465355/
  - GitHub: https://github.com/nagavellivyshnavi

---

## License and Terms

This repository is maintained for showcase and demonstration purposes. Commercial brand names, trademarks, and restaurant assets belong to their respective owners.
