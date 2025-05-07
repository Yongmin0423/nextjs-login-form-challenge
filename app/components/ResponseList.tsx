"use client";

import { useOptimistic, startTransition } from "react";
import { deleteResponse } from "../tweets/[id]/actions";

interface Response {
  id: number;
  response: string;
  created_at: Date;
  userId: number;
  user: {
    id: number;
    username: string | null;
  };
}

interface ResponseListProps {
  responses: Response[];
  tweetId: number;
  currentUserId: number | null;
}

export default function ResponseList({
  responses,
  tweetId,
  currentUserId,
}: ResponseListProps) {
  const [optimisticResponses, updateOptimisticResponses] = useOptimistic(
    responses,
    (state, deletedId: number) =>
      state.filter((response) => response.id !== deletedId)
  );

  const handleDelete = async (responseId: number) => {
    startTransition(() => {
      updateOptimisticResponses(responseId);
    });
    await deleteResponse(responseId, tweetId);
  };

  if (optimisticResponses.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 bg-[#0A0A0A] ">
        아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {optimisticResponses.map((response) => (
        <div
          key={response.id}
          className="p-4 border border-gray-200 rounded-lg"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                {response.user.username?.charAt(0).toUpperCase() || "?"}
              </div>
              <div>
                <p className="font-medium">
                  {response.user.username || "사용자"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(response.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {currentUserId === response.userId && (
              <button
                onClick={() => handleDelete(response.id)}
                className="text-gray-400 hover:text-red-500"
                title="삭제"
              >
                ✕
              </button>
            )}
          </div>

          <p className="text-gray-800">{response.response}</p>
        </div>
      ))}
    </div>
  );
}
