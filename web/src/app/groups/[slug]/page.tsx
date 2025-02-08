"use client";
import HomeButton from "@/components/homebutton";
import PieChart from "@/components/piechart";
import api from "@/shared/api";
import useGroupStore from "@/stores/groups.store";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type Score = {
  _id: string;
  group: string;
  score: number;
  user: {
    _id: string;
    username: string;
    email: string;
  };
};

type Metric = {
  _id: string;
  tag: string; // name
  count: number;
};

export default function GroupPage() {
  const { slug } = useParams();
  const { groups, fetchGroups } = useGroupStore((state) => state);
  const [scores, setScores] = useState<Score[]>([]); // Each score doc has { email, userId, groupId, score }
  const [metrics, setMetrics] = useState<Metric[]>([]);

  const reload = useCallback(async () => {
    api.get<Score[]>("/scores", { group_id: slug as string }).then((data) => {
      setScores(data);
    });
    api.get<Metric[]>("/metrics", { group_id: slug as string }).then((data) => {
      console.log(data);
      setMetrics(
        data.map((metric) => ({
          _id: metric._id,
          tag: metric.tag
            .split("_")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" "),
          count: metric.count,
        }))
      );
    });
    setTimeout(reload, 5000);
  }, [slug]);

  // 1) Fetch scores for this group
  useEffect(() => {
    if (!slug) return;
    api.get<Score[]>("/scores", { group_id: slug as string }).then((data) => {
      setScores(data);
    });
    api.get<Metric[]>("/metrics", { group_id: slug as string }).then((data) => {
      setMetrics(
        data.map((metric) => ({
          _id: metric._id,
          tag: metric.tag
            .split("_")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" "),
          count: metric.count,
        }))
      );

      setTimeout(reload, 5000);
    });
  }, [reload, slug]);

  const group = useMemo(() => {
    const current = groups.find((group) => group._id === slug);
    if (!current) {
      fetchGroups();
    }
    return current;
  }, [fetchGroups, groups, slug]);

  // If group data is unavailable yet
  if (!group) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        Group not found...
      </div>
    );
  }
  // Sort users by score (descending)

  // 4) Sort the scores array first
  // const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  // 5) Render the leaderboard by looking up each user's name
  //    Note: If a user isn't found, fallback to "Unknown".
  return (
    <div className="min-h-screen text-white flex flex-col items-center p-10 w-full h-full">
      <HomeButton />
      <h1 className="text-3xl font-bold mb-6 w-full text-start capitalize">
        {group.name} — Leaderboard
      </h1>

      <div className="flex flex-row gap-8 w-full">
        <div className="flex flex-col gap-4 w-full ">
          {scores.map((score, index) => {
            return (
              <div
                key={index}
                className="flex justify-between bg-slate-700 bg-opacity-50 py-3 px-5 rounded-2xl items-center"
              >
                <span className="flex flex-row gap-4 text-center items-center">
                  <p className="font-extrabold text-lg">{index + 1}.</p>
                  <p className="font-thin text-lg capitalize">
                    {score.user.username}
                  </p>
                </span>
                <span className="text-lg font-thin">{score.score}</span>
              </div>
            );
          })}
        </div>
        <div className="w-[60%] flex flex-col gap-12 h-full">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-white">Catagories</h2>
            <div className="flex flex-wrap gap-2">
              {group.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-teal-700 text-white text-sm font-medium shadow-sm"
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="flex flex-row gap-2 items-center">
                    <p className="font-thin capitalize">
                      {tag.name.split("_").join(" ")}
                    </p>
                    <p>{tag.score} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[2px] bg-slate-700 w-full" />

          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold">My Content Distribution</h1>
            <div className="flex flex-col justify-center items-center">
              <PieChart metrics={metrics} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
