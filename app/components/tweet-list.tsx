"use client";
import { useRouter } from "next/navigation";
import type { InitialTweets } from "../page";

interface TweetListProps {
  initialTweets: InitialTweets;
  isLoading: boolean;
  hasMore: boolean;
  page: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function TweetList({
  initialTweets,
  isLoading,
  hasMore,
  page,
  onPrevious,
  onNext,
}: TweetListProps) {
  const router = useRouter();

  const onTweetClick = (tweetId: number) => {
    router.push(`/tweets/${tweetId}`);
  };

  return (
    <div className="flex flex-col gap-5">
      {initialTweets.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          표시할 트윗이 없습니다.
        </div>
      ) : (
        initialTweets.map((tweet) => (
          <div
            key={tweet.id}
            onClick={() => onTweetClick(tweet.id)}
            className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                {tweet.user.username?.charAt(0).toUpperCase() || "?"}
              </div>
              <span className="font-medium">
                {tweet.user.username || "사용자"}
              </span>
              <span className="text-gray-500 text-xs">
                {new Date(tweet.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="mb-2">{tweet.description}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                ❤️ <span>{tweet.likes.length}</span>
              </span>
            </div>
          </div>
        ))
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={onPrevious}
          disabled={page === 0 || isLoading}
          className={`rounded-md px-4 py-2 text-sm font-medium ${
            page === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95"
          }`}
        >
          ← 이전
        </button>
        <button
          onClick={onNext}
          disabled={!hasMore || isLoading}
          className={`rounded-md px-4 py-2 text-sm font-medium ${
            !hasMore
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95"
          }`}
        >
          다음 →
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      )}
    </div>
  );
}
