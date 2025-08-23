import { z } from "zod";

export const ProfileSchema = z.object({
  firstname: z.string().min(1, "First Name is required"),
  lastname: z.string().min(1, "Last Name is required"),
  birthday: z.date(),
  phone: z.string().min(1, "Phone is required"),
});
