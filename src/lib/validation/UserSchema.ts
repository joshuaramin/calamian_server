import { z } from "zod";
import { ProfileSchema } from "./ProfileSchema.js";

export const UserSchema = z.object({
  email: z.string().min(1, "Email Address is required"),
});

export const AuthSchema = z.object({
  email: z.string().min(1, "Email Address is required"),
  password: z.string().min(1, "Password is required"),
});

export const CreateUserSchema = z.object({
  ...UserSchema.shape,
  ...ProfileSchema.shape,
  role: z.enum(["admin", "manager", "staff"]),
  salary: z.float64(),
});
