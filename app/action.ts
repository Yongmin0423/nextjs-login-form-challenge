"use server";

import { z } from "zod";

const checkEmail = (email: string) => email.includes("@zod.com");

const formSchema = z.object({
  email: z
    .string()
    .email()
    .refine(checkEmail, "Only @zod.com emails are allowed"),
  username: z.string().min(5, "Username should be at least 5 characters long."),
  password: z
    .string()
    .min(10, "Username should be at least 5 characters long.")
    .regex(/\d/, "Password should contain at least one number (0123456789)."),
});

export const handleForm = async (prevState: any, formData: FormData) => {
  const data = {
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
  };

  const result = formSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
};
