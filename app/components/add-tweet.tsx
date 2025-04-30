"use client";
import { useActionState } from "react";
import { uploadTweet } from "../action";
import FormInput from "./form-input";

export default function AddTweet() {
  const [state, formAction] = useActionState(uploadTweet, null);
  return (
    <div className="mb-5">
      <form action={formAction} className="flex items-center gap-2">
        <FormInput
          name="description"
          id="id"
          type="text"
          placeholder="write a tweet here"
          className="bg-white placeholder:text-gray-400 text-black"
          errors={state?.fieldErrors.description}
        />
        <button className="bg-gray-400 p-1 rounded-md">작성완료</button>
      </form>
    </div>
  );
}
