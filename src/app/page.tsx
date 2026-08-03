import { HomePageClient } from "@/components/HomePageClient";
import { menuItems } from "@/data/menu";

export default function Home() {
  return <HomePageClient initialMenuItems={menuItems} />;
}
