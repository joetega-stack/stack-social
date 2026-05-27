"use client";
import React, { useEffect, useState } from "react";
import { getFollowers } from "@/utils/profile";

const Followers = () => {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    async function loadFollowers() {
      try {
        const res = await getFollowers();
        setFollowers(res);
        console.log("following", res);
      } catch (err) {
        console.err(err);
      }
    }
    loadFollowers();
  }, []);
  return (
    <div>
      <h1>Followers</h1>
      <div>
        {followers && (
          <div>
            {followers.map((acc) => {
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

export default Followers;
