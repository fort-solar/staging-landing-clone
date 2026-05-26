import ContactForm from "@/components/ui/contact/ContactForm";
import Footer from "@/components/features/global/Footer";
import Newsletter from "@/components/features/global/Newsletter";
import { getSectionCards } from "@/lib/site-pages";
import type { SitePageRecord } from "@/types/api.types";

function SectionContent({
  section,
}: {
  section: SitePageRecord["sections"][number];
}) {
  if (section.type === "contact_form") {
    return (
      <div className="rounded-[28px] border border-[#D9E7D9] bg-white p-6 shadow-sm">
        <ContactForm />
      </div>
    );
  }

  const cards = getSectionCards(section);

  return (
    <div className="space-y-6">
      {section.content ? (
        <div className="max-w-3xl text-base leading-7 text-[#475467]">
          {section.content}
        </div>
      ) : null}

      {cards.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <article
              key={`${card.title}-${index}`}
              className="rounded-[24px] border border-[#D6EAD6] bg-[#F7FBF7] p-5"
            >
              <h3 className="text-lg font-semibold text-[#101828]">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#475467]">{card.content}</p>
            </article>
          ))}
        </div>
      ) : null}

      {section.images && section.image_urls?.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {section.image_urls.slice(0, section.number_of_images ?? section.image_urls.length).map((imageUrl, index) => (
            <div
              key={`${imageUrl}-${index}`}
              className="min-h-[240px] rounded-[24px] bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function SitePageRenderer({ page }: { page: SitePageRecord }) {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 lg:gap-14 lg:py-14">
        {page.sections.map((section, index) => {
          const isHero = section.type === "hero" && index === 0;

          return (
            <section
              key={`${section.type}-${index}`}
              className={
                isHero
                  ? "overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#F3FBF0_0%,#EAF7FF_52%,#FFF8EA_100%)] px-6 py-10 lg:px-10 lg:py-14"
                  : "rounded-[32px] border border-[#E4E7EC] bg-white px-6 py-8 lg:px-8"
              }
            >
              <div className={isHero ? "max-w-3xl space-y-4" : "space-y-4"}>
                {section.title ? (
                  <h1
                    className={
                      isHero
                        ? "text-4xl font-bold tracking-tight text-[#101828] lg:text-6xl"
                        : "text-2xl font-semibold text-[#101828] lg:text-3xl"
                    }
                  >
                    {section.title}
                  </h1>
                ) : null}
                {section.subtitle ? (
                  <p
                    className={
                      isHero
                        ? "max-w-2xl text-lg leading-8 text-[#475467]"
                        : "text-base leading-7 text-[#475467]"
                    }
                  >
                    {section.subtitle}
                  </p>
                ) : null}
              </div>

              <div className={isHero ? "mt-8" : "mt-6"}>
                <SectionContent section={section} />
              </div>
            </section>
          );
        })}
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
}
