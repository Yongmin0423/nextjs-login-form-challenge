"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function likeTweet(tweetId: number) {
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        tweetId,
        userId: session.id!,
      },
    });
    revalidatePath(`/post/${tweetId}`);
  } catch (e) {}
}

export async function dislikeTweet(tweetId: number) {
  const session = await getSession();
  if (!session?.id) return;

  try {
    await db.like.delete({
      where: {
        id: {
          userId: session.id,
          tweetId,
        },
      },
    });
    revalidatePath(`/post/${tweetId}`);
  } catch (e) {
    console.error("좋아요 취소 실패:", e);
  }
}

const responseSchema = z.object({
  response: z
    .string({
      required_error: "댓글 내용을 입력해주세요",
      invalid_type_error: "댓글 내용은 문자열이어야 합니다",
    })
    .trim()
    .min(1, "댓글을 입력해주세요")
    .max(280, "댓글은 280자 이내로 작성해주세요"),
  tweetId: z
    .number({
      required_error: "트윗 ID가 필요합니다",
      invalid_type_error: "유효하지 않은 트윗 ID입니다",
    })
    .positive("유효하지 않은 트윗 ID입니다"),
});

// 댓글 추가 액션
export async function addResponse(prevState: any, formData: FormData) {
  const session = await getSession();

  const data = {
    response: formData.get("response"),
    tweetId: Number(formData.get("tweetId")),
  };

  // 유효성 검사
  const result = responseSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  }

  try {
    // 댓글 생성
    const newResponse = await db.response.create({
      data: {
        response: result.data.response,
        tweetId: result.data.tweetId,
        userId: session.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    revalidatePath(`/tweets/${result.data.tweetId}`);
    return { success: true, data: newResponse };
  } catch (e) {
    console.error("댓글 작성 실패:", e);
    return {
      fieldErrors: {},
      formErrors: ["댓글 작성에 실패했습니다"],
    };
  }
}

// 댓글 삭제 액션
export async function deleteResponse(responseId: number, tweetId: number) {
  const session = await getSession();

  try {
    const response = await db.response.findUnique({
      where: { id: responseId },
      select: { userId: true },
    });

    if (!response || response.userId !== session.id) {
      return {
        fieldErrors: {},
        formErrors: ["삭제 권한이 없습니다"],
      };
    }

    await db.response.delete({
      where: { id: responseId },
    });

    revalidatePath(`/tweets/${tweetId}`);
    return { success: true };
  } catch (e) {
    console.error("댓글 삭제 실패:", e);
    return {
      fieldErrors: {},
      formErrors: ["댓글 삭제에 실패했습니다"],
    };
  }
}
