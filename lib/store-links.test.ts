import {
  INSTALLER_SIGNUP_URL,
  STORE_ROOT_URL,
  storeSignupHref,
} from "@/lib/store-links";

describe("Fortsolar cross-application links", () => {
  it("uses the deployed store and installer origins", () => {
    expect(STORE_ROOT_URL).toBe("https://store.fortsolar.ng");
    expect(INSTALLER_SIGNUP_URL).toBe("https://installer.fortsolar.ng/signup");
  });

  it("builds the store signup handoff with encoded quote details", () => {
    const href = storeSignupHref({
      email: "ada+quote@example.com",
      name: "Ada & Chidi",
      phone: "+234 800 000 0000",
    });
    const url = new URL(href);

    expect(url.origin).toBe("https://store.fortsolar.ng");
    expect(url.pathname).toBe("/signup");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      email: "ada+quote@example.com",
      name: "Ada & Chidi",
      phone: "+234 800 000 0000",
    });
  });
});
