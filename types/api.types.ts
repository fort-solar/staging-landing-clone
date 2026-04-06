import z from "zod";


export type FormProps = {
  endpoint: string;
  method?: string;
  values?: unknown;
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
