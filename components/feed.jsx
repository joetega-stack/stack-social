"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import Likes from "@/components/likes";
import { followingFeed } from "@/utils/tasks";


const Feed = () => {
  const [feed, setFeed] = useState(null);
  async function feedSrc() {
    try {
      const data = await followingFeed()
      console.log("data",data)
      setFeed(data.posts);
    console.log(feed)
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    feedSrc();
  }, []);

  return (
    <div className="flex flex-col gap-5 p-5 h-full w-full">
      {feed ? (
        feed.map((item, idx) => {
          console.log("item",item)
          return (
            <div key={idx}
            className="border border-gray-300">
              <p>{item.content}</p>
              <p>{item.created_at}</p>
              <Likes postId={item.id} />
            </div>
          )
        })
      ) : (
        <p> loading...</p>
      )}
    </div>
  );
};

export default Feed;
