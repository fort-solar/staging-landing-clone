import HomeExploreClient from "@/components/ui/home/HomeExploreClient";
import { getLandingStoreCatalogPreview } from "@/lib/store-catalog";

export default async function HomeExplore() {
  const catalog = await getLandingStoreCatalogPreview();

  return <HomeExploreClient packages={catalog.packages} products={catalog.products} />;
}
