import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { logout } from "./actions";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    return user;
  }
  notFound();
}

export default async function Profile() {
  const user = await getUser();
  return (
    <div>
      <h1>welcome! {user?.username}!</h1>
      <h1>your Email: {user?.email}</h1>
      <form action={logout}>
        <button>Log out</button>
      </form>
    </div>
  );
}
