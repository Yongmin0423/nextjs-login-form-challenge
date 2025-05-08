// app/page.tsx
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

import HomeClient from "./components/home-client";

export async function getInitialTweets() {
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
    take: 5,
    orderBy: {
      created_at: "desc",
    },
  });

  return tweets;
}

export type InitialTweets = Awaited<ReturnType<typeof getInitialTweets>>;

export default async function Home() {
  // 세션 확인
  const session = await getSession();
  if (!session.id) {
    redirect("/log-in");
  }

  const initialTweets = await getInitialTweets();

  return (
    // <main className="max-w-2xl mx-auto">
    //   <div className="p-4">
    //     <h1 className="text-2xl font-bold mb-6">최신 트윗</h1>
    //     <AddTweet />
    //     <TweetList initialTweets={initialTweets} />
    //   </div>
    // </main>
    <HomeClient initialTweets={initialTweets} />
  );
}
