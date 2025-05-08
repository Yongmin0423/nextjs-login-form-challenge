"use server";
import db from "@/lib/db";

export async function searchTweets(prev: any, formData: FormData) {
  const keyword = formData.get("keyword")?.toString().trim() ?? "";

  if (!keyword) return [];

  const results = await db.tweet.findMany({
    where: {
      description: {
        contains: keyword,
      },
    },
    include: {
      user: true,
      likes: true,
    },
  });

  return results;
}
