"use client";
import FormButton from "@/app/components/form-btn";
import FormInput from "@/app/components/form-input";
import { useActionState } from "react";
import { createAccount } from "./action";
import Link from "next/link";

export default function CreateAccount() {
  const [state, formAction] = useActionState(createAccount, null);
  return (
    <div className="w-screen h-screen flex flex-col gap-10 justify-center items-center">
      <div className="text-4xl">🔥</div>
      <form action={formAction} className="w-1/2 flex flex-col  gap-7">
        <FormInput
          name="email"
          placeholder="Email"
          required
          errors={state?.fieldErrors.email}
        />
        <FormInput
          name="username"
          type="username"
          placeholder="Username"
          required
          errors={state?.fieldErrors.username}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.fieldErrors.password}
        />
        <FormInput
          name="confirm_password"
          type="password"
          placeholder="Confirm Password"
          required
          errors={state?.fieldErrors.confirm_password}
        />
        <FormButton text="Create Account" />
      </form>
      <Link href="/log-in"> 로그인</Link>
    </div>
  );
}
