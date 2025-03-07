// Purpose: Define the schema for the registration form.
import { z } from "zod";

export const registrationSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export type RegistrationSchemaType = z.infer<typeof registrationSchema>;
