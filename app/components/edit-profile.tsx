"use client";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";

interface FieldErrors {
  username?: string[];
  password?: string[];
  email?: string[];
  bio?: string[];
  general?: string[];
}

interface ActionState {
  fieldErrors?: FieldErrors;
  success?: boolean;
}

interface EditProfileProps {
  user: {
    id: number;
    username: string;
    email: string;
    bio?: string | null;
  };
  updateProfileAction: (
    state: ActionState | null,
    formData: FormData
  ) => Promise<ActionState>;
}

// 제출 버튼 컴포넌트
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
    >
      {pending ? "저장 중..." : "저장"}
    </button>
  );
}

export default function EditProfile({
  user,
  updateProfileAction,
}: EditProfileProps) {
  const [state, formAction] = useFormState<ActionState | null, FormData>(
    updateProfileAction,
    null
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">프로필 수정</h1>
      {state?.fieldErrors?.general && (
        <p className="text-red-500 mb-4">{state.fieldErrors.general[0]}</p>
      )}
      {state?.success && (
        <p className="text-green-500 mb-4">
          프로필이 성공적으로 업데이트되었습니다.
        </p>
      )}
      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            사용자 이름
          </label>
          <input
            type="text"
            name="username"
            id="username"
            defaultValue={user.username}
            className="w-full p-2 border rounded"
            required
          />
          {state?.fieldErrors?.username && (
            <p className="text-red-500 text-sm">
              {state.fieldErrors.username[0]}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            이메일
          </label>
          <input
            type="email"
            name="email"
            id="email"
            defaultValue={user.email}
            className="w-full p-2 border rounded"
            required
          />
          {state?.fieldErrors?.email && (
            <p className="text-red-500 text-sm">{state.fieldErrors.email[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium">
            소개
          </label>
          <textarea
            name="bio"
            id="bio"
            defaultValue={user.bio || ""}
            className="w-full p-2 border rounded"
            placeholder="자신을 소개하세요"
            rows={4}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            새 비밀번호
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-full p-2 border rounded"
            placeholder="새 비밀번호를 입력하세요"
          />
          {state?.fieldErrors?.password && (
            <p className="text-red-500 text-sm">
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>
        <div className="flex gap-4">
          <SubmitButton />
          <Link
            href={`/user/${user.username}`}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
