interface FormInputProps {
  type: string;
  placeholder: string;
  errors: string[];
  required: boolean;
  name: string;
}

export default function FormInput({
  type,
  placeholder,
  errors,
  required,
  name,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className={`h-12 w-full rounded-4xl border-none px-10 ring-2 placeholder:text-neutral-400 focus:outline-none focus:ring-4 ${
          errors.length > 0
            ? "ring-red-500 focus:ring-red-500"
            : "ring-neutral-200 focus:ring-gray-500"
        }`}
      />

      {errors.map((error, index) => (
        <span key={index} className="font-medium text-red-500">
          {error}
        </span>
      ))}
    </div>
  );
}
