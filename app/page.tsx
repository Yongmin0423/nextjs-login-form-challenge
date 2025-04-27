import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-6">
      <div className="flex w-full h-full flex-col items-center gap-3">
        <Link
          href="/create-account"
          className="w-30 rounded-md bg-emerald-300 py-2.5 text-center text-lg font-medium text-black transition-colors hover:bg-orange-400 hover:text-white transform-all"
        >
          시작하기
        </Link>
        <div className="flex gap-2">
          <span>이미 계정이 있나요?</span>
          <Link href="/log-in" className="hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
