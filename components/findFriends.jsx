"use client";
import React, { useContext, useEffect, useState } from "react";
import { appContext } from "@/context/globalContext";
import { GrConnect } from "react-icons/gr";
import { CiCirclePlus } from "react-icons/ci";
import { GrStatusGood } from "react-icons/gr";
import { followUser } from "@/utils/profile";


const FindFriends = () => {
  const { toggleRight,router,users,setUsers } = useContext(appContext);

 

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
        className="absolute top-0 right-0 h-full w-75 lg:w-110 p-5 bg-zinc-50 border-l border-gray-200 "
        onClick={(e) => e.stopPropagation()}
      >
        <span className="absolute insert-x-0 top-0 left-0 h-full w-full bg-white/5 blur"></span>
        <div className="flex gap-2">
           <div className="flex flex-1 border-b-2 border-gray-400 justify-center items-center gap-2">
          <h1 className="text-center text-2xl">Find Friends</h1>
          <GrConnect />
          </div>
          <button type="button" onClick={toggleRight} className="cursor-pointer text-2xl border border-gray-300 size-10 z-40">x</button>
       </div>

        <div className="mt-3">
          {users.map((user) => {
            return (
              <div key={user.id} className="z-10 flex">
                <div
                 onClick={()=> router.push(`/profile/${user.id}`)}
                  className="flex flex-1 justify-between items-center border-b border-gray-300 p-2 cursor-pointer z-20"
                >
                  <div className="flex gap-2 ">
                    <div className="border border-gray-300 size-10 rounded-full mt-1 overflow-hidden">
                      <img
                        src={user.profile_image}
                        alt={null}
                        className="object-cover"
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
