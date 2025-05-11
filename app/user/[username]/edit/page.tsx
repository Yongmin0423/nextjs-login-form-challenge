// app/users/[username]/edit/page.tsx
import EditProfile from "@/app/components/edit-profile";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { updateProfileAction } from "./actions";

interface EditProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function EditProfilePage({
  params,
}: EditProfilePageProps) {
  const session = await getSession();
  const resolvedParams = await params;

  // 권한 확인: 로그인한 사용자와 수정하려는 프로필의 사용자가 일치하는지
  if (!session.id || session.username !== resolvedParams.username) {
    redirect(`/users/${resolvedParams.username}`);
  }

  const user = await db.user.findUnique({
    where: { username: resolvedParams.username },
    select: {
      id: true,
      username: true,
      email: true,
      bio: true,
    },
  });

  if (!user) notFound();

  // 필요한 데이터만 선택해서 전달
  const userInfo = {
    id: user.id,
    username: user.username,
    email: user.email,
    bio: user.bio || null,
  };

  // 클라이언트 컴포넌트에 서버 액션을 props로 전달
  return (
    <EditProfile user={userInfo} updateProfileAction={updateProfileAction} />
  );
}
