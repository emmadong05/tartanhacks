"use client";

import api from "@/shared/api";
import useGroupStore from "@/stores/groups.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  const { groups, fetchGroups } = useGroupStore((state) => state);

  useEffect(() => {
    api.get<boolean>("users/validate").then((data) => {
      if (!data) {
        router.push("/auth/login");
      }
      fetchGroups();
    });
  }, [fetchGroups, router]);

  return (
    <div
      className=" flex flex-col gap-4 items-center min-h-screen text-white"
      // style={{
      //   background:
      //     "radial-gradient(125% 125% at 50% 10%, #010b1d 40%, #03404d 100%)",
      // }}
    >
      {/* <GridBG /> */}
      {/* <button
        onClick={handleLogout}
        className="absolute bottom-4 left-4 bg-teal-800 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition duration-150"
      >
        Log Out
      </button> */}
      {/* <button
        onClick={() => router.push("/groups/create")}
        className="absolute top-4 right-24 bg-teal-800 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition duration-150"
      >
        Create Group
      </button> */}
      <h1 className="text-3xl font-bold mt-10">My Groups</h1>

      <div className="w-[60%] h-[2px] bg-slate-700 m-4" />

      {/* Grid Layout for 3 columns per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl px-4">
        {groups.map((group, index) => (
          <div
            key={index}
            onClick={() => router.push(`/groups/${group._id}`)}
            className="p-4 h-80 rounded-lg flex flex-col gap-2 justify-between text-white text-lg shadow-md transition-transform transform hover:scale-105 bg-slate-800 bg-opacity-40 hover:bg-opacity-60 border-white align-top"
          >
            <div className="flex flex-col gap-2">
              {/* capitalize first char */}
              <h2 className="text-2xl font-bold capitalize">{group.name}</h2>
              {/* line */}
              <div className="h-[2px] w-[80%] bg-teal-800 my-2"></div>
              <p className="font-thin text-[15px]">{group.description}</p>
            </div>
            <div
              className="flex flex-row overflow-auto"
              style={{
                scrollbarWidth: "none",
              }}
            >
              {group.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex flex-row gap-2 text-xs text-white px-2 py-1 justify-center items-center align-center"
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  <div
                    className="w-2 h-2 bg-teal-800 rounded-full"
                    style={{
                      marginTop: "0.05rem",
                    }}
                  />
                  {tag.name.split("_").join(" ")}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div onClick={() => router.push("/groups/create")}>
          <div className="w-64 h-80 rounded-2xl flex justify-center items-center border-slate-400 border-[2px] hover:opacity-50 transition-all">
            <p className="text-[100px] font-thin text-center mt-[-16px] text-slate-400 cursor-pointer">
              +
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
