"use client";
import React, { useContext, useEffect, useState } from "react";
import { GrConnect } from "react-icons/gr";
import { appContext } from "@/context/globalContext";
import { getAllUsers } from "@/utils/profile";
import { CiCirclePlus } from "react-icons/ci";
import { followUser } from "@/utils/profile";
import { GrStatusGood } from "react-icons/gr";


const FindFriends = () => {
  const { toggleRight,router } = useContext(appContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await getAllUsers();
        const normalized = res.map((user) => ({
          ...user,
          isFollowing: user.is_following,
        }));
        setUsers(normalized);
      } catch (err) {
        console.error(err);
      }
    }
    loadUsers();
  }, []);

  async function handleFollow(id) {
    try {
      const res = await followUser(id);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, isFollowing: res.is_following } : user,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="fixed top-0 right-0 w-full h-full lg:z-50" onClick={toggleRight}>
      <div
        className="absolute top-0 right-0 h-full w-75 lg:w-110 p-5 bg-zinc-50 border-l border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="absolute insert-x-0 top-0 left-0 h-full w-full bg-white/5 blur"></span>
        <div className="flex border-b-2 border-gray-400 justify-center items-center gap-2">
          <h1 className="text-center text-2xl">Find Friends</h1>
          <GrConnect />
        </div>

        <div className="mt-3">
          {users.map((user) => {
            return (
              <div key={user.id} className="z-10 flex">
                <div
                 onClick={()=> router.push(`/friendsProfileView/${user.id}`)}
                  className="flex flex-1 justify-between items-center border-b border-gray-300 p-2 cursor-pointer z-20"
                >
                  <div className="flex gap-2 ">
                    <div className="border size-10 rounded-full mt-1 overflow-hidden">
                      <img
                        src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${user.profile_image}`}
                        alt="profile"
                        className="size-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold font-serif">{`@${user.username}`}</p>
                      <p>{user.bio}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    handleFollow(user.id);
                    e.stopPropagation();
                  }}
                  className="cursor-pointer active:scale-98 text-gray-400 z-10"
                >
                  {user.isFollowing ? (
                    <GrStatusGood size={25} className="text-green-600" />
                  ) : (
                    <CiCirclePlus size={25} />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FindFriends;
