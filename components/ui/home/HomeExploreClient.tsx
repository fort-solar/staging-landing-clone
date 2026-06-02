"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SwiperSlide } from "swiper/react";

import BoltIcon from "@/components/features/icons/BoltIcon";
import BundleIcon from "@/components/features/icons/BundleIcon";
import CircularGreenCheck from "@/components/features/icons/CircularGreenCheck";
import { GreenMarkIcon } from "@/components/features/icons/GreenMarkIcon";
import { SlantedArrow } from "@/components/features/icons/SlantedArrow";
import { Button } from "@/components/ui/button";
import { MobileSlider } from "@/components/ui/mobileSlider";
import PublicEmptyState from "@/components/ui/public/PublicEmptyState";
import type { LandingStorePackage, LandingStoreProduct } from "@/lib/store-catalog";
import {
  STORE_PACKAGES_URL,
  STORE_PRODUCTS_URL,
  storePackageHref,
  storeProductHref,
} from "@/lib/store-links";

type HomeExploreClientProps = {
  packages: LandingStorePackage[];
  products: LandingStoreProduct[];
};

type ActiveSection = "Packages" | "Products";

function ExploreSectionToggle({
  activeSection,
  onSelect,
}: {
  activeSection: ActiveSection;
  onSelect: (section: ActiveSection) => void;
}) {
  return (
    <div className="flex text-2xl font-bold font-poppins lg:text-5xl">
      {(["Packages", "Products"] as const).map((section, index) => (
        <div key={section} className="flex items-center">
          {index > 0 ? <p className="px-2 py-1 lg:px-3 lg:py-4">&amp;</p> : null}
          <p
            className="relative inline-flex cursor-pointer items-center px-2 py-1 lg:py-4"
            onClick={() => onSelect(section)}
          >
            {activeSection === section ? (
              <GreenMarkIcon className="absolute inset-0 h-full w-full z-0" />
            ) : null}
            <span className={`relative z-10 ${activeSection !== section ? "opacity-60" : ""}`}>
              {section}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

function ExploreProductCard({ product }: { product: LandingStoreProduct }) {
  return (
    <div className="h-80 bg-[#EBFAEB] p-2">
      <Link
        href={storeProductHref(product.id)}
        className="group relative block h-full overflow-hidden rounded-lg bg-[#F2F4F7]"
      >
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain object-center p-4"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#000000af] via-[#00000040] to-[#00000000]" />
        <div className="absolute bottom-3 z-10 flex w-full flex-col items-start space-y-2 px-4">
          <p className="line-clamp-2 text-lg font-semibold font-poppins text-white">
            {product.title}
          </p>
          <p className="line-clamp-2 text-xs text-white">{product.description}</p>
          <span className="block w-full rounded-xl border border-white py-3 text-center text-sm text-white transition-all group-hover:border-[#2CB22C] group-hover:bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)]">
            View Details
          </span>
        </div>
      </Link>
    </div>
  );
}

function ExplorePackageCard({ item }: { item: LandingStorePackage }) {
  const packageIncludes = item.packageIncludes.length
    ? item.packageIncludes.slice(0, 2)
    : ["Component list is available on the package page"];
  const packagePowers = item.powers.length
    ? item.powers.slice(0, 7)
    : ["Full load details are available on the package page"];

  return (
    <Link
      href={storePackageHref(item.id)}
      className="group flex h-full flex-col justify-between gap-3 overflow-hidden rounded-lg border border-transparent bg-white px-4 pt-4 shadow-sm transition-all duration-300 hover:border-[#058A05] hover:bg-[#EBFAEB]"
    >
      <div className="flex w-full items-start justify-between gap-3">
        <p className="min-h-14 line-clamp-2 text-lg font-semibold text-[#3B3B3B]">
          {item.title}
        </p>
        <div className="rounded-lg border border-[#CCCCCC] p-3 transition-all duration-300 group-hover:border-[#058A05] group-hover:bg-[#058A05]">
          <SlantedArrow className="text-[#058A05] transition-colors duration-300 group-hover:text-white" />
        </div>
      </div>

      <div className="relative h-72 pt-5 perspective-1000 lg:h-60">
        <div className="absolute inset-0 hidden transition-transform duration-700 backface-hidden md:block group-hover:rotate-y-180">
          <Image
            fill
            src={item.image}
            alt={item.title}
            className="rounded-t-lg object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>

        <div className="relative h-full rounded-t-lg md:hidden">
          <Image
            fill
            src={item.image}
            alt={item.title}
            className="rounded-t-lg object-cover"
            sizes="100vw"
          />
        </div>

        <div className="relative hidden h-full rounded-t-lg bg-white p-4 transition-transform duration-700 md:absolute md:inset-0 md:block md:rotate-y-180 md:backface-hidden md:group-hover:rotate-y-360">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BundleIcon />
              <p className="text-sm font-bold text-[#036D03]">Bundle Components</p>
            </div>
            <div className="space-y-1">
              {packageIncludes.map((component) => (
                <div key={component} className="flex items-center justify-between gap-3">
                  <p className="line-clamp-1 text-[11px] text-[#3B3B3B]">{component}</p>
                  <CircularGreenCheck />
                </div>
              ))}
            </div>
            <hr className="border-[#3B3B3BB2]" />
            <div className="flex items-center gap-2">
              <BoltIcon />
              <p className="text-sm font-bold text-[#036D03]">Fortified To Power</p>
            </div>
            <ul className="flex max-h-16 flex-col flex-wrap gap-y-1">
              {packagePowers.map((power) => (
                <li key={power} className="pr-4 text-xs text-[#3B3B3B]">
                  {power}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ExploreEmptyState({ activeSection }: { activeSection: ActiveSection }) {
  return (
    <PublicEmptyState
      title={activeSection === "Packages" ? "No packages available right now" : "No products available right now"}
      description={
        activeSection === "Packages"
          ? "There are no live Fortsolar packages in the store right now."
          : "There are no live Fortsolar products in the store right now."
      }
      className="min-h-[22rem]"
    />
  );
}

export default function HomeExploreClient({
  packages,
  products,
}: HomeExploreClientProps) {
  const [activeSection, setActiveSection] = useState<ActiveSection>("Packages");
  const activeLink = activeSection === "Packages" ? STORE_PACKAGES_URL : STORE_PRODUCTS_URL;
  const activeItems = activeSection === "Packages" ? packages : products;

  return (
    <div className="bg-[#B8C0CC1A]">
      <div className="mx-auto min-h-[60vh] w-full max-w-6xl space-y-10 px-4 py-10 sm:items-start">
        <div className="mt-6 flex flex-col items-center gap-1 text-center lg:gap-3">
          <p className="text-2xl font-bold font-poppins lg:text-5xl">Explore Our Solar</p>
          <ExploreSectionToggle activeSection={activeSection} onSelect={setActiveSection} />
          <p className="mt-2 hidden max-w-xl font-medium lg:block">
            Affordable and efficient solutions tailored to your needs.
          </p>
        </div>

        {activeItems.length ? (
          <>
            <div>
              <MobileSlider extra={true}>
                {activeItems.map((item) => (
                  <SwiperSlide key={`${activeSection}-${item.id}`}>
                    {activeSection === "Packages" ? (
                      <ExplorePackageCard item={item as LandingStorePackage} />
                    ) : (
                      <ExploreProductCard product={item as LandingStoreProduct} />
                    )}
                  </SwiperSlide>
                ))}
              </MobileSlider>
            </div>

            <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {activeItems.map((item) =>
                activeSection === "Packages" ? (
                  <ExplorePackageCard key={`${activeSection}-desktop-${item.id}`} item={item as LandingStorePackage} />
                ) : (
                  <ExploreProductCard
                    key={`${activeSection}-desktop-${item.id}`}
                    product={item as LandingStoreProduct}
                  />
                ),
              )}
            </div>
          </>
        ) : (
          <ExploreEmptyState activeSection={activeSection} />
        )}

        <div className="flex w-full items-center justify-center py-4">
          <Link href={activeLink} className="w-full lg:w-fit">
            <Button className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)] py-6 text-sm text-white transition-all hover:opacity-90 lg:w-fit">
              {activeSection === "Packages" ? "See All Packages" : "See All Products"}
              <span aria-hidden>→</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
