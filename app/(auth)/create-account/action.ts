"use server"; // 파일 최상단에 추가

import db from "@/lib/db";
import getSession from "@/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

// 기본 유효성 검사만 하는 스키마
const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string!",
        required_error: "Please write a username",
      })
      .trim()
      .toLowerCase(),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .regex(/\d/, "Password should contain at least one number (0123456789)."),
    confirm_password: z.string(),
  })
  .refine(checkPassword, {
    message: "Both password should be the same",
    path: ["confirm_password"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  // 1. 기본 유효성 검사
  const validationResult = formSchema.safeParse(data);
  if (!validationResult.success) {
    return validationResult.error.flatten();
  }

  // 2. 사용자명 중복 확인
  const existingUsername = await db.user.findUnique({
    where: { username: validationResult.data.username },
    select: { id: true },
  });

  if (existingUsername) {
    return {
      fieldErrors: {
        username: ["This username is already taken"],
      },
      formErrors: [],
    };
  }

  // 3. 이메일 중복 확인
  const existingEmail = await db.user.findUnique({
    where: { email: validationResult.data.email },
    select: { id: true },
  });

  if (existingEmail) {
    return {
      fieldErrors: {
        email: ["This email is already taken"],
      },
      formErrors: [],
    };
  }

  // 4. 사용자 생성
  const hashedPassword = await bcrypt.hash(validationResult.data.password, 15);
  const user = await db.user.create({
    data: {
      username: validationResult.data.username,
      email: validationResult.data.email,
      password: hashedPassword,
    },
    select: {
      id: true,
    },
  });

  // 5. 세션 설정 및 리다이렉트
  const session = await getSession();
  session.id = user.id;
  await session.save();

  redirect("/profile");
}
