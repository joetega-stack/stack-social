"use client";
import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { appContext } from "@/context/globalContext";
import { getToken } from "@/lib/auth";
import { getCurrentUser } from "@/utils/profile";
import { IoPersonOutline, IoSettingsOutline } from "react-icons/io5";
import CreatePost from "./createPost";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import FindFriends from "./findFriends";
import { RxPeople } from "react-icons/rx";

const Aside = () => {
  const { toggleAside, router, openPost, setOpenPost, toggleRight } =
    useContext(appContext);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const token = getToken();
        console.log(token);
        if (!token) return;

        const res = await getCurrentUser();
        setCurrentUser(res);

        console.log("aside", res);
      } catch (err) {
        console.error("no current user", err);
      }
    }
    loadUser();
  }, []);

  const imageUrl = currentUser?.profile_image
    ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${currentUser.profile_image}`
    : null;

  return (
    <div className="fixed lg:w-200 w-full h-full top-0" onClick={toggleAside}>
      <div
        className="absolute top-0 left-0 w-75 h-full bg-zinc-50 p-5 border-r border-gray-200 lg:w-110 lg:z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div onClick={() => router.push("/profile")}>
          {currentUser && (
            <img
              src={imageUrl}
              alt="Cover"
              className="size-15 border rounded-full cursor-pointer"
            />
          )}
        </div>
        <div onClick={() => router.push("/profile")}>
          {currentUser && (
            <p className="font-bold text-2xl font-serif cursor-pointer">{`${currentUser.username}`}</p>
          )}
          {currentUser && <p>{`@${currentUser.username}`}</p>}
        </div>
        <div className="*:flex *:gap-2 flex gap-2">
          <Link href={"/follow?tab=followers"} className="cursor-pointer">
            followers{" "}
            <div>
              {currentUser && (
                <p className="font-semibold">{currentUser.followers_count}</p>
              )}
            </div>
          </Link>
          <Link href={"/follow?tab=following"}>
            following{" "}
            <div>
              {currentUser && (
                <p className="font-semibold">{currentUser.following_count}</p>
              )}
            </div>
          </Link>
        </div>
        <div className="mt-5 border-t border-gray-300 py-1 *:mt-3">
          <div
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <IoPersonOutline size={25} />
            <p className="font-bold"> Profile</p>
          </div>
          <div
            onClick={() => router.push("/settings")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <IoSettingsOutline size={25} />
            <p className="font-bold"> Settings</p>
          </div>
          <div onClick={toggleRight} className="cursor-pointer lg:flex items-center gap-2 hidden">
            <RxPeople size={25} /><p className="font-bold">Find Friends</p>
          </div>
          <div className="mr-15 z-50">
            <div
              onClick={() => setOpenPost(!openPost)}
              className="p-4 rounded-full bg-violet-700 border-2 border-white cursor-pointer z-50 hidden lg:block"
            >
              {openPost ? (
                ""
              ) : (
                <HiOutlinePencilSquare className="text-white" size={25} />
              )}
            </div>
            <div className="mt-20 border-t w-65 border-gray-300 py-5 *:bg-violet-700 *:rounded-2xl *:text-white flex *:flex *:items-center *:cursor-pointer *:justify-center flex-col gap-3 z-50 ">
              <div className="w-32 py-1 "
              onClick={()=> router.push("/signup")}>Create account</div>
              <div className="w-15 py-1"
              onClick={()=> router.push("/login")}>Login</div>
            </div>
            {openPost ? <CreatePost /> : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aside;
