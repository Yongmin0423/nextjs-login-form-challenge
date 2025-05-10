"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ActionState } from "@/types";

const checkUsernameExists = async (
  username: string,
  currentUsername: string
) => {
  if (username === currentUsername) return false;
  const user = await db.user.findUnique({
    where: { username },
    select: { id: true },
  });
  return Boolean(user);
};

const checkEmailExists = async (email: string, currentEmail: string) => {
  if (email === currentEmail) return false;
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return Boolean(user);
};

// 세션 검증
async function validateSession() {
  const session = await getSession();

  if (!session.id || !session.username) {
    return {
      isValid: false,
      error: "로그인이 필요합니다.",
    };
  }

  return {
    isValid: true,
    username: session.username,
    id: session.id,
  };
}
const profileSchema = z.object({
  username: z.string().refine(async (username) => {
    const session = await getSession();
    return !(await checkUsernameExists(username, session.username || ""));
  }, "이미 사용 중인 사용자 이름입니다."),
  email: z
    .string()
    .email("유효한 이메일 주소를 입력해주세요")
    .refine(async (email) => {
      const user = await db.user.findUnique({
        where: { username: (await getSession()).username || "" },
        select: { email: true },
      });
      return !(await checkEmailExists(email, user?.email || ""));
    }, "이미 사용 중인 이메일입니다."),
  bio: z.string().optional(),
  password: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    z
      .string()
      .regex(/\d/, "Password should contain at least one number (0123456789).")
      .optional()
  ),
});

interface UpdateData {
  username: string;
  email: string;
  bio: string | null;
  password?: string;
}

// 프로필 업데이트 서버 액션
export async function updateProfileAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  // 세션 검증
  const sessionCheck = await validateSession();
  if (!sessionCheck.isValid) {
    return {
      fieldErrors: {
        general: [sessionCheck.error || "알 수 없는 오류가 발생했습니다."],
      },
      success: false,
    };
  }
  // 현재 사용자 정보 가져오기
  const user = await db.user.findUnique({
    where: { username: sessionCheck.username },
    select: {
      id: true,
      username: true,
      email: true,
      bio: true,
    },
  });

  if (!user) {
    return {
      fieldErrors: {
        general: ["사용자를 찾을 수 없습니다."],
      },
      success: false,
    };
  }

  const data = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    bio: formData.get("bio") as string,
    password: formData.get("password") as string,
  };

  // spa를 줄임말로 사용하는 경우 그대로 유지
  const result = await profileSchema.spa(data);
  if (!result.success) {
    return {
      ...result.error.flatten(),
      success: false,
    };
  }

  const updateData: UpdateData = {
    username: result.data.username,
    email: result.data.email,
    bio: result.data.bio || null,
  };

  // 비밀번호 해시 처리
  if (result.data.password) {
    updateData.password = await bcrypt.hash(result.data.password, 10);
  }

  // 사용자 정보 업데이트
  await db.user.update({
    where: { id: user.id },
    data: updateData,
  });

  // 세션 업데이트 (username 변경 시)
  if (result.data.username !== sessionCheck.username) {
    const session = await getSession();
    session.username = result.data.username;
    await session.save();
  }

  // 리다이렉트 전에 성공 상태 반환
  redirect(`/user/${result.data.username}`);
  return {
    success: true,
  };
}
