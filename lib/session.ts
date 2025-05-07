"use server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
  username?: string;
}

export default async function getSession() {
  return getIronSession<SessionContent>(await cookies(), {
    cookieName: "login-form-check",
    password: process.env.COOKIE_PASSWORD!,
  });
}
