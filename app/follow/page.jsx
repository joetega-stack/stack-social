"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getFollowers } from "@/utils/profile";
import Followers from "@/components/followers";
import Following from "@/components/following";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";

function FollowPageContent() {
  const [followers, setFollowers] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const tab = searchParams.get("tab");
  useEffect(() => {
    async function handleFollower() {
      try {
        const res = await getFollowers();
        setFollowers(res);
        console.log("follower", res);
      } catch (err) {
        console.error(err);
      }
    }

    handleFollower();
  }, []);
  return (
    <div>
      <div className="h-15 w-full bg-gray-200 flex justify-center gap-5 items-end">
        <Link
          href={"/profile"}
          className="absolute left-0 top-1 w-8 h-8 bg-black/30 text-white font-bold text-2xl flex justify-center items-center rounded-full m-2 cursor-pointer active:scale-98"
        >
          <IoArrowBack />
        </Link>
        <button
          className={`${tab === "followers" ? "border-b-4 border-blue-500 px-1" : ""} h-6 cursor-pointer`}
          onClick={() => router.push("/follow?tab=followers")}
        >
          followers
        </button>
        <button
          className={`${tab === "following" ? "border-b-4 border-blue-500 px-1" : ""} h-6 cursor-pointer`}
          onClick={() => router.push("/follow?tab=following")}
        >
          following
        </button>
      </div>
      <div>{tab === "following" ? <Following /> : <Followers />}</div>
    </div>
  );
}


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FollowPageContent />
    </Suspense>
  )
}
