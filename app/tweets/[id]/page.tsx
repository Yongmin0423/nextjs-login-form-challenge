// app/tweets/[id]/page.tsx
import db from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import getSession from "@/lib/session";

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
      likes: true,
    },
  });

  if (!tweet) {
    notFound();
  }

  return tweet;
}

export default async function TweetDetailPage({
  params,
}: TweetDetailPageProps) {
  const tweet = await getTweet(params.id);

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

        <p className="text-lg mb-4">
          {tweet.userId} {/* 실제 트윗 내용이 없어서 userId를 표시 */}
        </p>

        <div className="flex items-center gap-4 text-gray-500">
          <span className="flex items-center gap-1">
            ❤️ <span>{tweet.likes.length}개의 좋아요</span>
          </span>
        </div>
      </div>

      {/* 여기에 나중에 답글 작성 폼과 답글 목록을 추가 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">답글</h3>
        <p className="text-gray-500">답글 기능은 곧 추가될 예정입니다.</p>
      </div>
    </div>
  );
}

// 페이지 메타데이터 동적 생성
export async function generateMetadata({ params }: TweetDetailPageProps) {
  const tweet = await getTweet(params.id);
  return {
    title: `${tweet.user.username || "사용자"}의 트윗`,
    description: `트윗 ID: ${tweet.id}`,
  };
}
