"use client";

import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { CldUploadWidget } from "next-cloudinary";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

type Dish = {
  id: string;
  name: string;
  description: string;
  prices: Record<string, number>;
  category: string;
  image_url: string;
};

export default function AdminPage() {
  const { user } = useUser();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(dishes.map((d) => d.category)));
    return ["All", ...unique];
  }, [dishes]);

  const filteredDishes = useMemo(() => {
    if (activeCategory === "All") return dishes;
    return dishes.filter((d) => d.category === activeCategory);
  }, [activeCategory, dishes]);

  const fetchDishes = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "menuItems"));
    const fetchedDishes: Dish[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      fetchedDishes.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        prices: data.prices || { Regular: 0 },
        category: data.category,
        image_url: data.image_url,
      });
    });
    setDishes(fetchedDishes);
    setLoading(false);
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const handleSave = async (dish: Dish) => {
    if (dish.id === "new") {
      const { id, ...newDishData } = dish;
      await addDoc(collection(db, "menuItems"), newDishData);
    } else {
      const dishRef = doc(db, "menuItems", dish.id);
      await updateDoc(dishRef, {
        name: dish.name,
        description: dish.description,
        prices: dish.prices,
        category: dish.category,
        image_url: dish.image_url,
      });
    }
    setEditingDish(null);
    fetchDishes();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this dish?")) {
      await deleteDoc(doc(db, "menuItems", id));
      fetchDishes();
    }
  };

  const handleUploadSuccess = (result: any) => {
    if (editingDish) {
      setEditingDish({ ...editingDish, image_url: result.info.secure_url });
    }
  };

  const handlePriceChange = (portion: string, newPrice: number) => {
    if (editingDish) {
      setEditingDish({
        ...editingDish,
        prices: {
          ...editingDish.prices,
          [portion]: newPrice,
        },
      });
    }
  };

  const removePricePortion = (portion: string) => {
    if (editingDish) {
      const newPrices = { ...editingDish.prices };
      delete newPrices[portion];
      setEditingDish({ ...editingDish, prices: newPrices });
    }
  };

  const addPricePortion = () => {
    if (editingDish) {
      const newPortion = prompt("Enter portion name (e.g., Half, Full, Large):");
      if (newPortion && !editingDish.prices[newPortion]) {
        setEditingDish({
          ...editingDish,
          prices: { ...editingDish.prices, [newPortion]: 0 },
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4 md:p-8">
      <header className="flex justify-between items-center mb-8 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-playfair text-[#DFB15B]">Admin Dashboard</h1>
          <p className="text-neutral-400">Welcome, {user?.firstName || "Admin"}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="hidden md:flex text-sm text-[#DFB15B] hover:text-white border border-[#DFB15B] px-4 py-2 rounded transition-colors">
            View Live Website
          </Link>
          <Link href="/" className="md:hidden text-sm text-[#DFB15B] hover:text-white border border-[#DFB15B] px-3 py-1 rounded transition-colors">
            Home
          </Link>
          <UserButton />
        </div>
      </header>

      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 max-w-full pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold shrink-0 transition-colors ${
                activeCategory === cat
                  ? "bg-[#DFB15B] text-black"
                  : "bg-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() =>
            setEditingDish({
              id: "new",
              name: "",
              description: "",
              prices: { Regular: 0 },
              category: categories[1] || "Mandi",
              image_url: "",
            })
          }
          className="bg-[#DFB15B] text-black px-4 py-2 rounded font-bold hover:bg-[#e8c078] transition shrink-0"
        >
          + Add New Dish
        </button>
      </div>

      {loading ? (
        <p>Loading dishes...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDishes.map((dish) => (
            <div key={dish.id} className="bg-neutral-800 p-4 rounded-lg flex flex-col border border-neutral-700">
              <div className="flex gap-4 mb-4">
                {dish.image_url ? (
                  <img src={dish.image_url} alt={dish.name} className="w-20 h-20 object-cover rounded" />
                ) : (
                  <div className="w-20 h-20 bg-neutral-700 flex items-center justify-center rounded text-xs text-neutral-500 text-center p-1">No Image</div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base truncate">{dish.name}</h3>
                  <p className="text-xs text-neutral-400 mb-2">{dish.category}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(dish.prices).map(([portion, price]) => (
                      <span key={portion} className="text-xs bg-neutral-900 px-2 py-1 rounded border border-neutral-700">
                        {portion}: <span className="text-[#DFB15B] font-bold">₹{price}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-auto flex justify-between pt-4 border-t border-neutral-700">
                <button
                  onClick={() => setEditingDish(dish)}
                  className="text-blue-400 text-sm font-bold hover:text-blue-300 transition px-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(dish.id)}
                  className="text-red-400 text-sm font-bold hover:text-red-300 transition px-2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingDish && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl mb-4 text-[#DFB15B] font-playfair">
              {editingDish.id === "new" ? "Add New Dish" : "Edit Dish"}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-neutral-400">Name</label>
                <input
                  type="text"
                  value={editingDish.name}
                  onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white focus:outline-none focus:border-[#DFB15B]"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-neutral-400">Description</label>
                <textarea
                  value={editingDish.description || ""}
                  onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white h-20 focus:outline-none focus:border-[#DFB15B]"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-neutral-400">Category</label>
                <input
                  type="text"
                  value={editingDish.category}
                  onChange={(e) => setEditingDish({ ...editingDish, category: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white focus:outline-none focus:border-[#DFB15B]"
                  list="category-suggestions"
                />
                <datalist id="category-suggestions">
                  {categories.filter(c => c !== "All").map(c => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm text-neutral-400">Prices</label>
                  <button onClick={addPricePortion} className="text-xs text-[#DFB15B] hover:underline">+ Add Portion</button>
                </div>
                <div className="space-y-2">
                  {Object.entries(editingDish.prices).map(([portion, price]) => (
                    <div key={portion} className="flex items-center gap-2">
                      <div className="bg-neutral-800 px-3 py-2 rounded border border-neutral-700 text-sm min-w-[80px]">
                        {portion}
                      </div>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => handlePriceChange(portion, Number(e.target.value))}
                        className="flex-1 bg-neutral-800 border border-neutral-700 rounded p-2 text-white focus:outline-none focus:border-[#DFB15B]"
                      />
                      <button 
                        onClick={() => removePricePortion(portion)}
                        className="text-red-400 p-2 hover:text-red-300"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {Object.keys(editingDish.prices).length === 0 && (
                    <p className="text-xs text-red-400">Please add at least one portion/price.</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1 text-neutral-400">Image</label>
                {editingDish.image_url && (
                  <img src={editingDish.image_url} alt="Preview" className="w-full h-32 object-contain bg-neutral-800 mb-2 rounded border border-neutral-700" />
                )}
                
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  onSuccess={handleUploadSuccess}
                  options={{
                    sources: ['local', 'url', 'camera'],
                    multiple: false,
                    maxFiles: 1,
                  }}
                >
                  {({ open }) => {
                    return (
                      <button
                        onClick={() => open()}
                        className="w-full border-2 border-dashed border-neutral-600 rounded p-4 text-neutral-400 hover:text-white hover:border-[#DFB15B] transition flex flex-col items-center justify-center gap-2"
                      >
                        <span>Click to Upload Image</span>
                        <span className="text-xs">(Transparent .png recommended)</span>
                      </button>
                    );
                  }}
                </CldUploadWidget>
              </div>
            </div>

            <div className="mt-8 flex gap-4 justify-end">
              <button
                onClick={() => setEditingDish(null)}
                className="px-4 py-2 text-neutral-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(editingDish)}
                disabled={Object.keys(editingDish.prices).length === 0}
                className="bg-[#DFB15B] text-black px-6 py-2 rounded font-bold hover:bg-[#e8c078] transition disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
