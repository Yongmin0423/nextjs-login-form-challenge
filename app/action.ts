"use server";

export const handleForm = async (prevState: any, formData: FormData) => {
  console.log(formData.get("password"));
  const password = formData.get("password");

  await new Promise((resolve) => setTimeout(resolve, 5000));

  return password !== "12345"
    ? {
        errors: ["wrong password"],
        ok: false,
      }
    : { errors: [], ok: true };
};
