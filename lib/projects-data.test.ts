import { fetchCollectionPage } from "@/lib/public-content";
import { getProjectsPage, normalizeProjectRecord } from "@/lib/projects-data";

jest.mock("@/lib/public-content", () => ({
  fetchAllCollectionRecords: jest.fn(),
  fetchCollectionPage: jest.fn(),
}));

describe("normalizeProjectRecord", () => {
  it("hydrates image galleries from nested CMS media collections", () => {
    const normalized = normalizeProjectRecord({
      slug: "lekki-community-microgrid",
      title: "Lekki Community Microgrid",
      summary: "Hybrid solar project for a gated estate.",
      status: "published",
      community: "Admiralty Way Estate",
      city: "Lekki",
      state: "Lagos",
      country: "Nigeria",
      media: [
        {
          url: "https://cdn.example.com/projects/lekki/hero.jpg",
          mime_type: "image/jpeg",
        },
        {
          url: "https://cdn.example.com/projects/lekki/battery.webp",
          mime_type: "image/webp",
        },
        {
          url: "https://cdn.example.com/projects/lekki/walkthrough.mp4",
          mime_type: "video/mp4",
        },
      ],
      system_details: {
        inverter_size: "20kVA",
        pv_size: "15kW",
        battery_size: "30kWh",
      },
      what_it_powers: ["Lighting", "Cooling"],
      created_at: "2026-05-20T00:00:00.000Z",
    });

    expect(normalized).toEqual(
      expect.objectContaining({
        slug: "lekki-community-microgrid",
        title: "Lekki Community Microgrid",
        locationLabel: "Lekki, Lagos, Nigeria",
        community: "Admiralty Way Estate",
        galleryImages: [
          "https://cdn.example.com/projects/lekki/hero.jpg",
          "https://cdn.example.com/projects/lekki/battery.webp",
        ],
        heroImages: [
          "https://cdn.example.com/projects/lekki/hero.jpg",
          "https://cdn.example.com/projects/lekki/battery.webp",
        ],
        systemDetails: {
          inverterSize: "20kVA",
          pvSize: "15kW",
          batterySize: "30kWh",
        },
        whatItCanPower: ["Lighting", "Cooling"],
      }),
    );
  });
});

describe("getProjectsPage", () => {
  const mockedFetchCollectionPage =
    fetchCollectionPage as jest.MockedFunction<typeof fetchCollectionPage>;

  afterEach(() => {
    mockedFetchCollectionPage.mockReset();
  });

  it("loads only the public projects collection for portfolio pages", async () => {
    mockedFetchCollectionPage.mockResolvedValue({
      basePath: "/api/v1/projects",
      data: [
        {
          slug: "lekki-community-microgrid",
          title: "Lekki Community Microgrid",
          status: "published",
          city: "Lekki",
          state: "Lagos",
          country: "Nigeria",
          media: {
            image_urls: ["https://cdn.example.com/projects/lekki/hero.jpg"],
          },
          created_at: "2026-05-20T00:00:00.000Z",
        },
      ],
      pagination: {
        page: 2,
        limit: 12,
        total: 13,
        totalPages: 2,
      },
    } as never);

    const payload = await getProjectsPage(2, 12);

    expect(mockedFetchCollectionPage).toHaveBeenCalledWith(
      ["/api/v1/projects", "/api/v1/projects/"],
      {
        page: 2,
        limit: 12,
        query: {
          status: "published",
        },
      },
    );
    expect(mockedFetchCollectionPage.mock.calls[0]?.[0]).not.toContain(
      "/api/v1/installations",
    );
    expect(payload).toEqual({
      data: [
        expect.objectContaining({
          slug: "lekki-community-microgrid",
          title: "Lekki Community Microgrid",
          galleryImages: ["https://cdn.example.com/projects/lekki/hero.jpg"],
        }),
      ],
      pagination: {
        page: 2,
        limit: 12,
        total: 13,
        totalPages: 2,
      },
    });
  });
});
