"use client";
import api from "@/shared/api";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    api.post("register", { email, username, password }).then(() => {
      router.push("/auth/login");
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm p-6 bg-slate-800 bg-opacity-50 shadow-md rounded-lg">
        <h1 className="text-center text-2xl font-semibold text-white">
          Register
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 border border-slate-600 rounded-2xl bg-opacity-5 bg-white placeholder-slate-400 text-white focus:outline-none font-light align-middle"
          />

          <input
            type="text"
            placeholder="Username (for display)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="p-3 border border-slate-600 rounded-2xl bg-opacity-5 bg-white placeholder-slate-400 text-white focus:outline-none font-light align-middle"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 border border-slate-600 rounded-2xl bg-opacity-5 bg-white placeholder-slate-400 text-white focus:outline-none font-light align-middle"
          />
          <button
            type="submit"
            className="p-3 bg-teal-800 bg-opacity-50 text-white rounded-2xl cursor-pointer hover:bg-opacity-75 transition-transform duration-150"
          >
            Register
          </button>
          <p className="w-full text-center text-slate-400"> — or — </p>
          <button
            onClick={() => router.push("/auth/login")}
            className="p-3 bg-teal-800 bg-opacity-50 text-white rounded-2xl cursor-pointer hover:bg-opacity-75 transition-transform duration-150"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
