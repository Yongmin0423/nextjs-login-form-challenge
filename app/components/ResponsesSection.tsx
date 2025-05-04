"use client";

import { useOptimistic, startTransition } from "react";
import ResponseForm from "./ResponseForm";
import ResponseList from "./ResponseList";

interface User {
  id: number;
  username: string | null;
}

interface Response {
  id: number;
  response: string;
  created_at: Date;
  userId: number;
  user: User;
}

interface ResponsesSectionProps {
  tweetId: number;
  initialResponses: Response[];
  currentUserId: number | null;
}

export default function ResponsesSection({
  tweetId,
  initialResponses,
  currentUserId,
}: ResponsesSectionProps) {
  // 낙관적 UI 업데이트를 위한 상태 관리
  const [optimisticResponses, addOptimisticResponse] = useOptimistic(
    initialResponses,
    (state, newResponse: Response) => {
      return [newResponse, ...state];
    }
  );

  const handleAddResponse = (newResponse: Response) => {
    startTransition(() => {
      addOptimisticResponse(newResponse);
    });
  };

  return (
    <div>
      {currentUserId ? (
        <ResponseForm tweetId={tweetId} onAddResponse={handleAddResponse} />
      ) : (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg text-center">
          <p>댓글을 작성하려면 로그인이 필요합니다.</p>
        </div>
      )}

      <ResponseList
        responses={optimisticResponses}
        tweetId={tweetId}
        currentUserId={currentUserId}
      />
    </div>
  );
}
