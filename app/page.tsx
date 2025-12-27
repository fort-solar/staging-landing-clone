import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans dark:bg-black ">
      <main className="flex min-h-screen w-full max-w-6xl px-4 flex-col items-center justify-between py-32  bg-white dark:bg-black sm:items-start">
        {/* <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        /> */}
       <h1>Testing cleanup</h1>
      </main>
    </div>
  );
}
