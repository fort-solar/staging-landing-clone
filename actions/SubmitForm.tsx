import { BASE_URL } from "@/components/features/constants";
import { FormProps, FetchResponseType } from "@/types/api.types";

export const submitForm = async ({
  endpoint,
  method,
  values,
}: FormProps): Promise<FetchResponseType> => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: method ?? "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");

      const errorResponse = isJson
        ? await response.json().catch(() => null)
        : null;

      const errorMessage =
        errorResponse && typeof errorResponse === "object"
          ? Object.values(errorResponse).flat().join(" | ")
          : response.statusText;

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error
        ? error.message
        : "Something went wrong",
    };
  }
};
 