"use client";
import { useFormStatus } from "react-dom";

interface FormButtonProps {
  text: string;
}

export default function FormButton({ text }: FormButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="h-12 text-black font-bold bg-gray-400 rounded-4xl disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:text-neutral-300"
    >
      {text}
    </button>
  );
}
