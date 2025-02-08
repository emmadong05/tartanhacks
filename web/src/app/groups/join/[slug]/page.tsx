"use client";

import api from "@/shared/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function JoinGroupPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get<boolean>("users/validate").then((data) => {
      if (!data) {
        router.push("/auth/login");
      }

      api
        .post("groups/join", { group_id: slug as string })
        .then(() => {
          setSuccess(true);
        })
        .catch(() => {
          router.push("/");
        });
    });
  }, [router, slug]);

  if (!success) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900">
        <div className="w-full max-w-md p-6 bg-slate-800 shadow-md rounded-lg text-center">
          <h1 className="text-3xl font-bold text-teal-700">
            Joining group . . .
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-6 bg-slate-800 shadow-md rounded-lg text-center">
        <h1 className="text-3xl font-bold text-teal-700">Success!</h1>
        <p className="text-lg mt-2 text-slate-300">
          You have now joined the group.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 px-6 py-3 bg-teal-800 text-white rounded-2xl hover:bg-teal-700 transition duration-150"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
