import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { menuItems } from "@/data/menu";

export async function GET() {
  try {
    const dishesCol = collection(db, "dishes");
    let count = 0;
    
    for (const item of menuItems) {
      await addDoc(dishesCol, {
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image_url: item.image,
        is_popular: item.isPopular || false,
        is_veg: item.isVeg || false,
      });
      count++;
    }

    return NextResponse.json({ message: `Successfully migrated ${count} dishes to Firestore.` });
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
