"use server";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { z } from "zod";

// 페이지 크기 상수 정의
const PAGE_SIZE = 5;

// 다음/이전 페이지 트윗 가져오기
export async function getTweetsPage(
  direction: "next" | "prev",
  currentPage: number
) {
  // 페이지 계산
  const nextPage = direction === "next" ? currentPage + 1 : currentPage - 1;

  // 이전 페이지가 0보다 작으면 빈 배열 반환
  if (nextPage < 0) {
    return [];
  }

  const skip = nextPage * PAGE_SIZE;

  const tweets = await db.tweet.findMany({
    select: {
      updated_at: true,
      user: true,
      userId: true,
      likes: true,
      created_at: true,
      id: true,
      description: true,
    },
    skip: skip,
    take: PAGE_SIZE,
    orderBy: {
      created_at: "desc",
    },
  });

  return tweets;
}

const TweetSchema = z.object({
  description: z.string({
    required_error: "Description is required",
  }),
});

export async function uploadTweet(prev: any, formData: FormData) {
  const data = {
    description: formData.get("description"),
  };
  const result = TweetSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      await db.tweet.create({
        data: {
          description: result.data.description,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
      });
    }
  }
}
