"use client";

import api from "@/shared/api";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    api.post<{ token: string }>("login", { email, password }).then((data) => {
      localStorage.setItem("token", data.token);
      console.log(localStorage.getItem("token"));
      router.push("/");
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm p-6 bg-slate-800 bg-opacity-50 shadow-md rounded-2xl flex flex-col gap-2">
        <h1 className="text-center text-2xl font-semibold text-white">
          Welcome
        </h1>
        <div className="flex flex-col gap-4 mt-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
            className="p-3 border border-slate-600 rounded-2xl bg-opacity-5 bg-white placeholder-slate-400 text-white focus:outline-none font-light align-middle"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
            className="p-3 border border-slate-600 rounded-2xl bg-opacity-5 bg-white placeholder-slate-400 text-white focus:outline-none font-light align-middle"
          />
          <button
            onClick={handleSubmit}
            className="py-2 bg-teal-800 bg-opacity-50 text-white rounded-2xl cursor-pointer hover:bg-opacity-75 transition-all duration-150 text-center"
          >
            Login
          </button>
          <p className="w-full text-center text-slate-400"> — or — </p>
          <button
            onClick={() => router.push("/auth/register")}
            className="py-2 bg-teal-800 bg-opacity-50 text-white rounded-2xl cursor-pointer hover:bg-opacity-75 transition-all duration-150 text-center"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
