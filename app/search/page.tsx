"use client";
import { useActionState } from "react";
import { searchTweets } from "./actions"; // 상대경로 주의
import { useRouter } from "next/navigation";

export default function Search() {
  const router = useRouter();
  const [tweets, formAction] = useActionState(searchTweets, []);

  const onTweetClick = (tweetId: number) => {
    router.push(`/tweets/${tweetId}`);
  };

  return (
    <div>
      <form action={formAction} className="mb-6">
        <input
          type="text"
          name="keyword"
          className="border px-4 py-2 w-full rounded"
          placeholder="트윗 내용 검색"
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          검색
        </button>
      </form>

      <div className="flex flex-col gap-5">
        {tweets.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            표시할 트윗이 없습니다.
          </div>
        ) : (
          tweets.map((tweet) => (
            <div
              key={tweet.id}
              onClick={() => onTweetClick(tweet.id)}
              className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition"
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
      </div>
    </div>
  );
}
