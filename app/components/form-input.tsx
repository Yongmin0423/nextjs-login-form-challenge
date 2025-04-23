import { InputHTMLAttributes } from "react";

interface FormInputProps {
  errors?: string[];
  name: string;
}

export default function FormInput({
  errors = [],
  name,
  ...rest
}: FormInputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        {...rest}
        className={`h-12 w-full rounded-4xl border-none px-10 ring-2 placeholder:text-neutral-400 focus:outline-none focus:ring-4 ${
          errors.length > 0
            ? "ring-red-200 focus:ring-red-200"
            : "ring-neutral-200 focus:ring-gray-500"
        }`}
      />

      {errors.map((error, index) => (
        <span key={index} className="font-medium text-red-200">
          {error}
        </span>
      ))}
    </div>
  );
}
