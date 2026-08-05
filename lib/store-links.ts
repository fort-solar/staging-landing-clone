export const STORE_ROOT_URL = "https://store.fortsolar.ng";
export const STORE_PRODUCTS_URL = `${STORE_ROOT_URL}/products`;
export const STORE_PACKAGES_URL = `${STORE_ROOT_URL}/packages`;
export const STORE_SIGNUP_URL = `${STORE_ROOT_URL}/signup`;
export const INSTALLER_SIGNUP_URL = "https://installer.fortsolar.ng/signup";

type StoreSignupPrefill = {
  email: string;
  name: string;
  phone: string;
};

export function storeSignupHref(prefill: StoreSignupPrefill) {
  const url = new URL(STORE_SIGNUP_URL);

  url.searchParams.set("email", prefill.email);
  url.searchParams.set("name", prefill.name);
  url.searchParams.set("phone", prefill.phone);

  return url.toString();
}

export function storeProductHref(id: string | number) {
  return `${STORE_PRODUCTS_URL}/${id}`;
}

export function storePackageHref(id: string | number) {
  return `${STORE_PACKAGES_URL}/${id}`;
}
