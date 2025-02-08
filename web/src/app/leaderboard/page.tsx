"use client";

import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  score: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const userList: User[] = [
      { id: 1, name: "Alice", score: 723 },
      { id: 2, name: "Bob", score: 651 },
      { id: 3, name: "Charlie", score: 702 },
      { id: 4, name: "David", score: 537 },
      { id: 5, name: "Eve", score: 608 },
      { id: 6, name: "Frank", score: 489 },
      { id: 7, name: "Grace", score: 751 },
      { id: 8, name: "Hannah", score: 303 },
      { id: 9, name: "Isaac", score: 17 },
      { id: 10, name: "Jack", score: 595 },
      { id: 11, name: "Kate", score: 514 },
      { id: 12, name: "Leo", score: 0 },
      { id: 13, name: "Mia", score: 220 },
      { id: 14, name: "Noah", score: 715 },
      { id: 15, name: "Olivia", score: 509 },
    ];

    const sortedUsers = userList.sort((a, b) => b.score - a.score);
    setUsers(sortedUsers);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex justify-center items-center overflow-y-auto p-4">
      <div className="w-full max-w-3xl p-6 bg-slate-800 shadow-lg rounded-2xl">
        <h2 className="text-center text-2xl font-semibold text-white mb-4 bg-teal-800 p-3 rounded-xl">
          Leaderboard
        </h2>
        <table className="w-full border-collapse border border-slate-700 rounded-2xl overflow-hidden">
          <thead>
            <tr className="bg-teal-800 text-white rounded-xl">
              <th className="p-3 text-left rounded-l-xl">Rank</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-right rounded-r-xl">Score</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="border-b border-slate-700 hover:bg-slate-700 transition duration-200 rounded-xl"
              >
                <td className="p-3 rounded-l-xl">{index + 1}</td>
                <td className="p-3">{user.name}</td>
                <td className="p-3 text-right rounded-r-xl">{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
