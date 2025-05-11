import db from "@/lib/db";
import getSession from "@/lib/session";
import Link from "next/link";
import { notFound } from "next/navigation";

type UserDetailProps = {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: UserDetailProps) {
  const resolvedParams = await params;
  const user = await db.user.findUnique({
    where: { username: resolvedParams.username },
    include: {
      tweets: {
        include: {
          likes: true,
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });

  if (!user) notFound();

  const session = await getSession();

  console.log("session", session);

  const isOwner = session?.username === user.username;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">@{user.username}</h1>
      <p className="text-gray-600 mb-1">Email: {user.email}</p>
      <p className="text-gray-700 mb-4">{user.bio ?? "소개가 없습니다."}</p>
      {isOwner && (
        <Link
          href={`/user/${user.username}/edit`}
          className="text-sm text-blue-500 border px-3 py-1 rounded hover:bg-blue-50"
        >
          ✏️ 수정하기
        </Link>
      )}

      <h2 className="text-xl font-semibold mb-3">작성한 트윗</h2>
      {user.tweets.length === 0 ? (
        <div className="text-gray-400">아직 작성한 트윗이 없습니다.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {user.tweets.map((tweet) => (
            <Link
              href={`/tweets/${tweet.id}`}
              key={tweet.id}
              className="border p-4 rounded shadow-sm"
            >
              <p className="mb-2">{tweet.description}</p>
              <div className="text-sm text-gray-500">
                작성일: {new Date(tweet.created_at).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">
                ❤️ {tweet.likes.length}개
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
