import { useRouter } from "next/navigation";

export default function HomeButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/")}
      className="absolute top-3 right-3 bg-opacity-50 text-white py-3 px-2 rounded-2xl cursor-pointer hover:bg-opacity-75 transition-transform duration-150"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/delta.png"
        alt="home"
        className="w-10 h-10 hover:opacity-50 transition-all"
      />
    </button>
  );
}
