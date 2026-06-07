"use client";
import React, { useEffect, useState,useContext } from "react";
import { getFollowing } from "@/utils/profile";
import { appContext } from "@/context/globalContext";


const Following = () => {
  const [following, setFollowing] = useState([]);
  const {router} = useContext(appContext)

  useEffect(() => {
    async function handleFollowing() {
      try {
        const res = await getFollowing();
        setFollowing(res);
        console.log("following", res);
      } catch (err) {
        console.err(err);
      }
    }
    handleFollowing();
  }, []);
  return (
    <div>
      <div>
        {following && (
          <div>
            {following.map((acc) => {
              return (
                <div key={acc.id} className="z-10 flex">
                  <div
                    onClick={() =>
                      router.push(`/friendsProfileView/${acc.id}`)
                    }
                    className="flex flex-1 justify-between items-center border-b border-gray-300 p-2 cursor-pointer z-20"
                  >
                    <div className="flex gap-2 ">
                      <div className="border size-10 rounded-full mt-1 overflow-hidden">
                        <img
                          src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${acc.profile_image}`}
                          alt="profile"
                          className="size-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold font-serif">{`@${acc.username}`}</p>
                        <p>{acc.bio}</p>
                      </div>
                    </div>
                  </div>
                 
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Following;
