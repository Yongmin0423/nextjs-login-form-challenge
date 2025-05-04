"use client";

import { useOptimistic, useTransition } from "react";
import { dislikeTweet, likeTweet } from "../tweets/actions";

interface LikeButtonProps {
  tweetId: number;
  initialLikeCount: number;
  initialIsLiked: boolean;
}

export default function LikeButton({
  tweetId,
  initialLikeCount,
  initialIsLiked,
}: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();

  // 좋아요 상태를 optimistic하게 관리
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(
    { count: initialLikeCount, isLiked: initialIsLiked },
    (state, newState) => ({ ...state, ...newState })
  );

  const handleLike = () => {
    if (isPending) return;

    startTransition(async () => {
      // 좋아요 상태 업데이트
      if (optimisticLikes.isLiked) {
        // 좋아요 취소
        setOptimisticLikes({
          count: optimisticLikes.count - 1,
          isLiked: false,
        });
        await dislikeTweet(tweetId);
      } else {
        // 좋아요 추가
        setOptimisticLikes({ count: optimisticLikes.count + 1, isLiked: true });
        await likeTweet(tweetId);
      }
    });
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={`flex items-center gap-1 transition-colors ${
        optimisticLikes.isLiked
          ? "text-red-500"
          : "text-gray-500 hover:text-red-500"
      }`}
    >
      {optimisticLikes.isLiked ? "❤️" : "🤍"}
      <span>{optimisticLikes.count}개의 좋아요</span>
    </button>
  );
}
