"use server";
import db from "@/lib/db";

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
    },
    skip: skip,
    take: PAGE_SIZE,
    orderBy: {
      created_at: "desc",
    },
  });

  return tweets;
}

// 좋아요 기능 구현
export async function likeTweet(tweetId: number, userId: number) {
  const existingLike = await db.like.findFirst({
    where: {
      tweetId,
      userId,
    },
  });

  if (existingLike) {
    // 이미 좋아요가 있으면 취소
    await db.like.delete({
      where: {
        id: existingLike.id,
      },
    });
    return { liked: false };
  } else {
    // 좋아요가 없으면 추가
    await db.like.create({
      data: {
        tweet: {
          connect: {
            id: tweetId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return { liked: true };
  }
}
