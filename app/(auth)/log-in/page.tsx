"use client";
import FormButton from "@/app/components/form-btn";
import FormInput from "@/app/components/form-input";
import { useActionState } from "react";
import { LoginForm } from "./action";
import Link from "next/link";

export default function Login() {
  const [state, formAction] = useActionState(LoginForm, null);
  return (
    <div className="w-screen h-screen flex flex-col gap-10 justify-center items-center">
      <div className="text-4xl">🔥</div>
      <form action={formAction} className="w-1/2 flex flex-col  gap-7">
        <FormInput
          name="email"
          placeholder="Email"
          required
          errors={
            state?.fieldErrors && "email" in state.fieldErrors
              ? state.fieldErrors.email
              : undefined
          }
        />
        {/* <FormInput
          name="username"
          type="username"
          placeholder="Username"
          required
          errors={state?.fieldErrors.username}
        /> */}
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.fieldErrors.password}
        />
        <FormButton text="Log in" />
      </form>
      <Link href="/create-account">Create Account</Link>
    </div>
  );
}
