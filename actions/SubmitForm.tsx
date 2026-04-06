import { BASE_URL } from "@/components/features/constants";
import { FormProps } from "@/types/api.types";

export const submitForm = async ({
  endpoint,
  method,
  values,
}: FormProps): Promise<unknown> => {
  const base = (BASE_URL ?? "").replace(/\/$/, "");
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${base}${normalizedEndpoint}`;

  const response = await fetch(url, {
    method: method ?? "POST",
    headers: {
      "Content-Type": "application/json",
    },
    ...(values !== undefined ? { body: JSON.stringify(values) } : {}),
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const responseBody = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const fallback = response.statusText || "Something went wrong";
    const message =
      responseBody && typeof responseBody === "object"
        ? (responseBody as { message?: string }).message ??
          Object.values(responseBody).flat().join(" | ") ??
          fallback
        : fallback;
    throw new Error(message);
  }

  return responseBody;
};
 
