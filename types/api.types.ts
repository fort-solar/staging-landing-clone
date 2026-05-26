import z from "zod";


export type FormProps = {
  endpoint: string;
  method?: string;
  values?: unknown;
};

export type SitePageSection = {
  type: string;
  title?: string;
  subtitle?: string;
  card?: boolean;
  number_of_cards?: number;
  content?: string;
  images?: boolean;
  number_of_images?: number;
  image_urls?: string[];
};

export type SitePageRecord = {
  id?: string;
  title: string;
  slug: string;
  page_type?: string;
  status?: string;
  sections: SitePageSection[];
};

export type SitePageListApiResponse = {
  success: boolean;
  data?: SitePageRecord[];
};

export type SitePageDetailApiResponse = {
  success: boolean;
  data?: SitePageRecord;
};


export const ContactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(6, "Invalid phone number"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required")
});


export type ContactFormData = z.infer<typeof ContactFormSchema>;
