// AddTweet.tsx
"use client";
import { useActionState } from "react";
import { uploadTweet } from "../action";
import FormInput from "./form-input";
import { InitialTweets } from "../page";
import getSession from "@/lib/session";

interface AddTweetProps {
  onTweetAdd: (tweet: InitialTweets[number]) => void;
  addOptimisticTweet: (tweet: InitialTweets[number]) => void;
}

export default function AddTweet({
  onTweetAdd,
  addOptimisticTweet,
}: AddTweetProps) {
  const sessionPromise = getSession();
  const [state, formAction] = useActionState(async (prev: any, formData: FormData) => {
    const description = formData.get("description") as string;
    // 낙관적 트윗 생성
    const optimisticTweet = {
      id: Date.now(), // 임시 ID
      description,
      created_at: new Date(),
      updated_at: new Date(),
      userId: (await sessionPromise).id || 0,
      user: {
        id: (await sessionPromise).id || 0,
        username: (await sessionPromise).username || "Unknown User",
        email: "", // 임시 이메일
        bio: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      likes: [],
    };
    addOptimisticTweet(optimisticTweet); // 낙관적 업데이트
    const result = await uploadTweet(prev, formData);
    if (result && "tweet" in result) {
      onTweetAdd(result.tweet); // 서버 트윗으로 부모 상태 업데이트
    }
    return result || { error: "Failed to upload tweet" };
  }, null);

  return (
    <div className="mb-5">
      <form action={formAction} className="flex items-center gap-2">
        <FormInput
          name="description"
          id="id"
          type="text"
          placeholder="write a tweet here"
          className="bg-white placeholder:text-gray-400 text-black"
        />
        <button className="bg-gray-400 p-1 rounded-md">작성완료</button>
      </form>
    </div>
  );
}
