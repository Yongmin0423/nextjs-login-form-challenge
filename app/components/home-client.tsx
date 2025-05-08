"use client";

import { useState, useOptimistic } from "react";
import AddTweet from "./add-tweet";
import TweetList from "./tweet-list";
import { getTweetsPage } from "../action";
import type { InitialTweets } from "../page";

interface Props {
  initialTweets: InitialTweets;
}

export default function HomeClient({ initialTweets }: Props) {
  const [tweets, setTweets] = useState(initialTweets);
  const [optimisticTweets, addOptimisticTweet] = useOptimistic<
    InitialTweets,
    InitialTweets[number]
  >(tweets, (state, newTweet) => [newTweet, ...state]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const handleTweetAdd = (newTweet: InitialTweets[number]) => {
    setTweets((prev) => [newTweet, ...prev]);
    setPage(0); // 새 트윗 추가 시 첫 페이지로 리셋
  };

  const fetchTweets = async (direction: "next" | "prev") => {
    const newPage = direction === "next" ? page + 1 : page - 1;
    if (newPage < 0) return;

    setIsLoading(true);
    try {
      const newTweets = await getTweetsPage(direction, page);
      if (newTweets.length === 0) {
        setHasMore(false);
      } else {
        setTweets(newTweets);
        setPage(newPage);
        setHasMore(true);
      }
    } catch (error) {
      console.error("트윗 로딩 에러:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">최신 트윗</h1>
        <AddTweet
          onTweetAdd={handleTweetAdd}
          addOptimisticTweet={addOptimisticTweet}
        />
        <TweetList
          initialTweets={optimisticTweets}
          isLoading={isLoading}
          hasMore={hasMore}
          page={page}
          onPrevious={() => fetchTweets("prev")}
          onNext={() => fetchTweets("next")}
        />
      </div>
    </main>
  );
}
