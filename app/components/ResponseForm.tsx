"use client";

import { startTransition, useRef } from "react";
import { useOptimistic } from "react";
import { addResponse } from "../tweets/[id]/actions";

interface ResponseFormProps {
  tweetId: number;
  onAddResponse: (newResponse: {
    id: number;
    response: string;
    created_at: Date;
    user: {
      id: number;
      username: string | null;
    };
    userId: number;
  }) => void;
  currentUserId: number; // currentUserId만 넘겨받으면 됩니다.
  currentUsername: string | null; // username을 별도로 넘겨받으면 됩니다.
}

// 새 응답 인터페이스 정의
interface Response {
  id: number;
  tweetId: number;
  response: string;
  created_at: Date;
  user: {
    id: number;
    username: string | null;
  };
  userId: number;
}

export default function ResponseForm({
  tweetId,
  onAddResponse,
  currentUserId,
  currentUsername, // 이제 여기서 넘겨받은 username을 사용
}: ResponseFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  // 낙관적 업데이트
  const [optimisticState, addOptimisticResponse] = useOptimistic(
    { responses: [] as Response[] },
    (prev, newResponse: Response) => ({
      responses: [...prev.responses, newResponse],
    })
  );

  const handleFormAction = async (formData: FormData) => {
    const responseText = formData.get("response") as string;

    if (!responseText?.trim()) {
      return {
        success: false,
        fieldErrors: { response: ["댓글 내용을 입력하세요"] },
      };
    }

    // 1. 낙관적 응답 추가 (임시 응답 ID는 Math.random())
    const tempResponse: Response = {
      id: Math.random(),
      tweetId,
      response: responseText,
      created_at: new Date(),
      user: {
        id: currentUserId,
        username: currentUsername, // 넘겨받은 username을 사용
      },
      userId: currentUserId,
    };

    startTransition(() => {
      addOptimisticResponse(tempResponse);
    });

    // 2. 서버 호출
    try {
      const result = await addResponse(null, formData);
      if (result && "data" in result) {
        formRef.current?.reset();

        // 3. 실제 응답 부모에게 전달 (서버에서 받은 데이터)
        onAddResponse({
          id: result.data.id,
          response: result.data.response,
          created_at: result.data.created_at,
          user: result.data.user,
          userId: result.data.userId,
        });
      }
    } catch (error) {
      console.error("댓글 추가 오류:", error);
    }

    return {
      success: false,
      fieldErrors: { response: ["댓글 내용을 입력하세요"] },
    };
  };

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleFormAction(formData);
      }}
      className="mb-6"
    >
      <div className="mb-2">
        <input type="hidden" name="tweetId" value={tweetId} />
        <textarea
          name="response"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#0A0A0A]"
          rows={3}
          placeholder="댓글을 작성해주세요..."
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          댓글 달기
        </button>
      </div>
    </form>
  );
}
