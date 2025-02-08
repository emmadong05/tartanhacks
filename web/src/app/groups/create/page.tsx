"use client";

import HomeButton from "@/components/homebutton";
import api from "@/shared/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<{ name: string; score: number }[]>([]);
  const [name, setName] = useState("");
  const [score, setScore] = useState(0);

  const handleAddTag = () => {
    if (name.trim() !== "") {
      setTags([...tags, { name, score }]);
      setName("");
      setScore(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api
      .post<string>("groups/create", {
        group_name: groupName,
        group_description: description,
        tags: tags,
      })
      .then((response) => {
        // get current window path
        const url = new URL(window.location.href);
        const origin = url.origin;
        navigator.clipboard.writeText(origin + "/groups/join/" + response);
        router.push("/");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen  text-white overflow-y-auto">
      <HomeButton />
      <div className="w-full flex flex-col gap-4 max-w-lg p-6 bg-slate-800 bg-opacity-50 shadow-md rounded-lg">
        <h2 className="text-center text-2xl font-semibold text-white">
          Create Custom Group
        </h2>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            className="p-3 border border-slate-600 rounded-2xl bg-opacity-5 bg-white placeholder-slate-400 text-white focus:outline-none font-light align-middle"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-3 border border-slate-600 rounded-2xl bg-opacity-5 bg-white placeholder-slate-400 text-white focus:outline-none font-light align-middle"
          />
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Tag"
              value={name}
              onChange={(e) => setName(e.target.value.replace(/\s/g, "_"))}
              className="p-3 border border-slate-600 rounded-2xl bg-opacity-5 bg-white flex-grow placeholder-slate-400 text-white focus:outline-none font-light align-middle"
            />
            <input
              type="number"
              min="-10"
              max="10"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="p-3 border border-slate-600 rounded-2xl bg-opacity-5 bg-white w-20 placeholder-slate-400 text-white focus:outline-none font-light align-middle"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="p-3 bg-teal-800 bg-opacity-50 text-white rounded-2xl cursor-pointer hover:bg-opacity-75 transition-transform duration-150"
            >
              Add
            </button>
          </div>
          {/* Updated tag list display */}
          <div className="flex flex-row flex-wrap gap-2">
            {tags.map((item, index) => (
              <div
                key={index}
                className="flex flex-row gap-2 text-xs text-white px-2 py-1 justify-center items-center bg-slate-700 rounded-md"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.score < 0 ? "bg-red-800" : "bg-teal-800"
                  }`}
                  style={{ marginTop: "0.05rem" }}
                />
                {item.name} (Score: {item.score})
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="p-3 bg-teal-800 bg-opacity-50 text-white rounded-2xl cursor-pointer hover:bg-opacity-75 transition-transform duration-150"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
}
