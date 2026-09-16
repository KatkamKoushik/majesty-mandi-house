import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "majesty-mandi.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "majesty-mandi",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "majesty-mandi.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "545386451292",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:545386451292:web:877b47e5f4881ce80c7199",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-JDV6SH8D79"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrate() {
  try {
    const menuContent = fs.readFileSync(path.join(__dirname, "src/data/menu.ts"), "utf-8");
    const jsonStr = menuContent
      .replace(/export const menuItems: MenuItem\[\] = /, "global.menuItems = ")
      .replace(/export interface[\s\S]*?}\n\n/g, "")
      .replace(/import .*?\n/g, "");
    
    eval(jsonStr);
    const items = global.menuItems;

    const dishesCol = collection(db, "dishes");
    
    // First delete all existing docs to avoid duplicates
    const snapshot = await getDocs(dishesCol);
    let deletedCount = 0;
    for (const document of snapshot.docs) {
      await deleteDoc(doc(db, "dishes", document.id));
      deletedCount++;
    }
    console.log(`Deleted ${deletedCount} old documents.`);

    let count = 0;
    for (const item of items) {
      await addDoc(dishesCol, {
        name: item.name,
        description: item.description || "",
        prices: item.prices || { Regular: 0 },
        category: item.category,
        image_url: item.image || "",
        is_popular: item.isPopular || false,
        is_veg: item.isVeg || false,
      });
      count++;
    }
    console.log(`Successfully migrated ${count} dishes to Firestore with correct prices object.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
