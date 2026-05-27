"use client";
import React, { useEffect, useState } from "react";
import { getFollowing } from "@/utils/profile";

const Following = () => {
  const [following, setFollowing] = useState([]);

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
      <h1>Following</h1>
      <div>
        {following && (
          <div>
            {following.map((acc) => {
              return (
                <div key={acc.id} className="flex gap-2 px-5">
                  <div className="size-10 border rounded-full mt-1">
                    {acc.profile_image}
                  </div>
                  <div className="flex">
                    <div>{`@${acc.username}`}</div>
                    <div>{acc.bio}</div>
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
