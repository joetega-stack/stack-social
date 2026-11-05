"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { getFollowers,getFollowing } from "@/utils/profile";
import { IoArrowBack } from "react-icons/io5";


function FollowPageContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true)
  const router = useRouter();
  const params = useParams()
  const [users,setUsers] = useState([])

  const userId = params?.id

  const tab = searchParams.get("tab") || "followers";
  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true)
        const data = tab === "followers" ? await getFollowers(userId) : await getFollowing(userId);
        setUsers(data)
        console.log("follower", data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      loadUsers();
    }

  }, [userId, tab]);
  

  function changeTab(newTab) {
    router.push(`/follow/${userId}?tab=${newTab}`)
  }
  return (
    <div>
      <div className="h-15 w-full bg-gray-200 flex justify-center gap-5 items-end">
        <div
          onClick={()=> router.back()}
          className="absolute left-0 top-1 w-8 h-8 bg-black/30 text-white font-bold text-2xl flex justify-center items-center rounded-full m-2 cursor-pointer active:scale-98"
        >
          <IoArrowBack />
        </div>
        <button
          className={`${tab === "followers" ? "font-semibold" : "text-gray-500"} h-6 cursor-pointer`}
          onClick={() => changeTab("followers")}
        >
          Followers
          {tab ==="followers" && (<span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full"/>)}
        </button>
        <button
          className={`${tab === "following" ? "font-semibold" : "text-gray-500"} h-6 cursor-pointer`}
          onClick={() => changeTab("following")}
        >
          Following
          {tab==="following" && (<span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full" />)}
        </button>
      </div>
      <div>
        {loading ? (
          <div className="p-5 text-center">
            Loading...
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-4 border-b border-gray-300"
              onClick={()=> router.push(`/profile/${user.id}`)}
            >
              <img
                src={user.profile_image || "/default-avatar.png"}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover border border-gray-400"
              />

              <div>
                <p className="font-semibold">
                  {user.username}
                </p>

                <p className="text-sm text-gray-500">
                  {user.bio}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
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
