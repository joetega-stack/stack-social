"use client";
import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { appContext } from "@/context/globalContext";
import { getToken } from "@/lib/auth";
import { getCurrentUser } from "@/utils/profile";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

const Aside = () => {
  const { toggleAside } = useContext(appContext);
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
    <div className="fixed w-full h-full top-0" onClick={toggleAside}>
      <div
        className="absolute top-0 left-0 w-75 h-full bg-zinc-50 p-5 border-r border-gray-400"
        onClick={(e) => e.stopPropagation()}
      >
        <Link href={"/profile"}>
          {currentUser && (
            <img
              src={imageUrl}
              alt="Cover"
              className="size-15 border rounded-full"
            />
          )}
        </Link>
        <Link href={"/profile"}>
          {currentUser && <p className="font-bold text-2xl">{`${currentUser.username}`}</p>}
          {currentUser && <p>{`@${currentUser.username}`}</p>}
        </Link>
        <div className="*:flex *:gap-2 flex gap-2">
              <Link href={"/follow?tab=followers"} className="cursor-pointer">
            followers <div>{currentUser && <p className="font-bold">{currentUser.followers_count}</p>}</div>
              </Link>
              <Link href={"/follow?tab=following"}>
                following <div>{currentUser && <p className="font-bold">{currentUser.following_count}</p>}</div>
              </Link>
            </div>
        <Link href={"/message"} className="flex items-center mt-5 gap-2 border-t border-gray-400 pt-3 cursor-pointer">
          
          <IoChatboxEllipsesOutline size={30} />
         <p className="text-2xl"> Chat</p>
        </Link>
      </div>
    </div>
  );
};

export default Aside;
