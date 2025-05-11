// app/tweets/[id]/ResponsesSection.tsx

"use client";

import { useOptimistic, startTransition } from "react";
import ResponseForm from "./ResponseForm";
import ResponseList from "./ResponseList";

interface User {
  id: number;
  username: string | null; // 여기서도 username을 nullable로 설정
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
  currentUsername: string | null;
}

export default function ResponsesSection({
  tweetId,
  initialResponses,
  currentUserId,
  currentUsername, // username을 클라이언트에서 사용
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

  // 현재 사용자 정보 가져오기
  const currentUser = currentUserId
    ? { id: currentUserId, username: currentUsername }
    : null;

  return (
    <div>
      {currentUserId ? (
        <ResponseForm
          tweetId={tweetId}
          onAddResponse={handleAddResponse}
          currentUserId={currentUserId}
          currentUsername={currentUsername}
        />
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
