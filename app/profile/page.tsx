import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";
import { logout } from "./actions";
import Link from "next/link";

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
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <Link className="text-5xl hover:text-blue-500" href="/">
        Go to See the Tweets
      </Link>
      <h3 className="text-2xl">welcome! {user?.username}!</h3>
      <h3>Your email: {user?.email}</h3>
      <form action={logout}>
        <button className="cursor-pointer hover:text-red-400">Log out</button>
      </form>
    </div>
  );
}
