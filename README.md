# Majesty Mandi House - Web Application and Showcase

A production-grade, immersive web experience built for Majesty Mandi House, a premier Arabian Mandi restaurant located in Hanamkonda, Warangal, Telangana.

This project was conceived, designed, and developed by Koushik Katkam and Vyshnavi Nagavelli.

---

## Project Background

This web application was originally engineered by Koushik Katkam and Vyshnavi Nagavelli as a commercial product intended for acquisition by the management of Majesty Mandi House. The objective was to modernize the restaurant's digital presence, facilitate direct online take-out and delivery orders via WhatsApp, handle table reservations, and eliminate commissions charged by third-party food delivery aggregators.

When the restaurant management declined the purchase proposal, the developers chose to preserve the complete codebase and deploy it publicly as an active, high-performance showcase and engineering portfolio demonstration.

To communicate this context to visitors, a prominent announcement banner is placed at the top of the interface:
`CURRENTLY AVAILABLE FOR SHOWCASE PURPOSES. A CUSTOM WEB EXPERIENCE BUILT BY KOUSHIK & VYSHNAVI.`

All ordering workflows, menu configurations, reservation mechanisms, and administrative interfaces remain fully functional, demonstrating production-level full-stack engineering and luxury brand presentation.

---

## Live Demonstration

The production deployment is hosted on Vercel:
https://majesty-mandi-house-eight.vercel.app

---

## Core Capabilities and Architecture

### 1. Scroll-Driven 241-Frame Canvas Hero
- Renders an interactive 241-frame sequence (`frame_0000.webp` to `frame_0240.webp`) linked directly to the user's scroll progression.
- Uses an HTML5 `<canvas>` element managed through a requestAnimationFrame throttle to maintain consistent 60 FPS rendering without triggering React re-renders.
- Employs eager image preloading and cache-busting query strings to prevent stale asset delivery.
- Smoothly transitions into an interactive section presenting rotating signature Mandi platters.

### 2. Dual-Source Dynamic Menu Engine
- Primary data store: Google Cloud Firestore (`menuItems` collection).
- Secondary data store: Structured local fallback located in `src/data/menu.ts` to ensure continuous availability during network latency or quota limits.
- Category filtering: Specials, Chicken Starters, Chicken Mandi, Mutton Mandi, Seafood Mandi, Veg and Egg, Desserts, and Beverages.
- Supports multi-portion pricing structures per item (such as Single, Half, Full, 1 Piece, 2 Pieces, 4 Pieces, Jumbo).

### 3. WhatsApp Direct Order Dispatch
- Built-in slide-out Cart Drawer (`CartDrawer.tsx`) supporting quantity adjustments, portion selection, delivery or pickup designation, and customer delivery address capture.
- Automatically computes:
  - Item totals based on selected portion sizes
  - Order subtotal
  - Statutory 5% Goods and Services Tax (GST)
  - Final payable grand total
- Assembles the complete order into an encoded WhatsApp message string and dispatches it directly to the restaurant operations number (`+91 9502316909`).

### 4. Table Reservation System
- A dedicated reservation interface (`TableReservation.tsx`) that gathers guest party size, preferred date, time slot, customer contact info, and celebration occasion.
- Formulates a structured booking message sent directly through WhatsApp for immediate staff confirmation.

### 5. Birthday Promotion Modal
- An automated promotional modal (`BirthdayPromoModal.tsx`) that appears following initial page engagement.
- Allows patrons to submit their birth date to claim an exclusive 10% celebration discount via automated WhatsApp messaging.

### 6. High-Resolution Physical Menu Viewer
- A dedicated route at `/physical-menu` rendering full-bleed, high-resolution scans of the physical dine-in menu cards for diners who prefer the printed layout.

### 7. Authenticated Administrative Dashboard
- A secure route at `/admin` protected by Clerk Authentication (`@clerk/nextjs`).
- Complete CRUD operations on Firestore `menuItems`:
  - Creation of new menu items with custom portion price maps
  - Modification of item names, descriptions, prices, and categories
  - Direct image uploads to Cloudinary via `CldUploadWidget`
  - Deletion of menu items with instant UI synchronization
- A custom login interface at `/admin/login` styled consistently with the dark visual theme.

### 8. Ambient Video Layering
- Seamless looping background video elements embedded in the top showcase banner (`gold-particles.mp4`) and the footer section (`footer-particles.mp4`).
- Optimized using `autoPlay`, `loop`, `muted`, `playsInline`, and `preload="auto"` attributes.
- Configured in the Next.js middleware proxy (`src/proxy.ts`) to bypass authentication checks and allow direct CDN caching and streaming.

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

A `.env.local` file must be created in the root directory with the following variables:

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
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=project-id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-...

# Cloudinary (Admin Image Uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=cloudinary_upload_preset
```

---

## Installation and Local Setup

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

3. Configure environment variables:
   Create a `.env.local` file following the template above and supply valid credentials for Firebase, Clerk, and Cloudinary.

4. Optional - Seed the Firestore Database:
   If the Firestore database contains no initial documents, populate it with default records:
   ```bash
   node migrate.mjs
   ```

5. Launch the local development server:
   ```bash
   pnpm run dev
   ```

6. Navigate to `http://localhost:3000` in a web browser to view the application.

---

## Production Build

To assemble an optimized production build:

```bash
pnpm run build
```

To execute the production build locally:

```bash
pnpm run start
```

---

## Design and Typography Details

The visual system implements a Middle Eastern luxury culinary aesthetic:
- Primary Background: `#0A0A0B` / `#0B0B0C` (obsidian black)
- Primary Accent: `#DFB15B` and `#C5A059` (imperial gold)
- Accent Gradients: `#DFB15B` to `#F3A833`
- Typography:
  - `Cinzel`: Classical serif employed for titles, headings, and branding
  - `Playfair Display`: High-contrast editorial display serif
  - `Montserrat`: Geometric sans-serif utilized for badges, labels, and sub-headings
  - `Inter`: Neutral sans-serif used for body paragraphs and price listings

---

## Creators and Credits

Conceived, designed, and developed by:

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

This repository is maintained for demonstration and showcase purposes. Commercial brand names, trademarks, and establishment assets remain the property of their respective owners.
