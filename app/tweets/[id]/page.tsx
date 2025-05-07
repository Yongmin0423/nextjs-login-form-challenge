// app/tweets/[id]/page.tsx

import db from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import getSession from "@/lib/session";
import LikeButton from "@/app/components/like-button";
import ResponsesSection from "@/app/components/ResponsesSection";

interface TweetDetailPageProps {
  params: {
    id: string;
  };
}

async function getTweet(id: string) {
  const tweet = await db.tweet.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      user: true,
    },
  });

  if (!tweet) {
    notFound();
  }

  return tweet;
}

async function getLikeCount(tweetId: number) {
  const likeCount = await db.like.count({
    where: {
      tweetId,
    },
  });
  return likeCount;
}

async function isLikedByUser(tweetId: number) {
  const session = await getSession();
  if (!session?.id) return false;

  const like = await db.like.findUnique({
    where: {
      id: {
        userId: session.id,
        tweetId,
      },
    },
  });

  return !!like;
}

async function getResponses(tweetId: number) {
  const responses = await db.response.findMany({
    where: {
      tweetId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return responses;
}

export default async function TweetDetailPage({
  params,
}: TweetDetailPageProps) {
  const tweet = await getTweet(params.id);
  const likeCount = await getLikeCount(tweet.id);
  const isLiked = await isLikedByUser(tweet.id);
  const responses = await getResponses(tweet.id);
  const session = await getSession();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          ← 홈으로 돌아가기
        </Link>
      </div>

      <div className="border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            {tweet.user.username?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <h2 className="font-bold">{tweet.user.username || "사용자"}</h2>
            <p className="text-sm text-gray-500">
              {new Date(tweet.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <p className="text-lg mb-4">{tweet.description}</p>

        <div className="flex items-center gap-4">
          {session?.id ? (
            <LikeButton
              tweetId={tweet.id}
              initialLikeCount={likeCount}
              initialIsLiked={isLiked}
            />
          ) : (
            <span className="flex items-center gap-1 text-gray-500">
              ❤️ <span>{likeCount}개의 좋아요</span>
            </span>
          )}
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="bg-[#0A0A0A] p-4 rounded-lg border-white border">
        <h3 className="font-medium mb-4">댓글</h3>
        <ResponsesSection
          tweetId={tweet.id}
          initialResponses={responses}
          currentUserId={session?.id || null}
          currentUsername={session?.username || null} // 세션에서 username을 가져옴
        />
      </div>
    </div>
  );
}

// export async function generateMetadata({ params }: { params: { id: string } }) {
//   const tweet = await getTweet(params.id);
//   return {
//     title: `${tweet.user.username || "사용자"}의 트윗`,
//     description: `트윗 ID: ${tweet.id}`,
//   };
// }
