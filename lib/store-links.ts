export const STORE_ROOT_URL = "https://store.fortsolar.ng";
export const STORE_PRODUCTS_URL = `${STORE_ROOT_URL}/products`;
export const STORE_PACKAGES_URL = `${STORE_ROOT_URL}/packages`;
export const INSTALLER_SIGNUP_URL = "https://installer.fortsolar.ng/signup";

export function storeProductHref(id: string | number) {
  return `${STORE_PRODUCTS_URL}/${id}`;
}

export function storePackageHref(id: string | number) {
  return `${STORE_PACKAGES_URL}/${id}`;
}
