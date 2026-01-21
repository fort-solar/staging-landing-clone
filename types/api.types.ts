import z from "zod";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FetchResponseType<T = any> = Promise<{ data?: T; error?: string }>;

export type FormProps = {
  endpoint: string;
  method?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any;
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