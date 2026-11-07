"use client";
import React, { useState, useContext, useEffect } from "react";
import { appContext } from "@/context/globalContext";
import { formatDate } from "@/utils/formatdate";
import Likes from "@/components/likes";
import CreateCommentPost from "./createCommentPost";

const SearchPost = ({ posts }) => {
  const { query, setQuery } = useContext(appContext);
  const [delayQuery, setDelayQuery] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setDelayQuery(query), 2000)
    return ()=> clearTimeout(timer)
  },[query])


  const filteredPosts = delayQuery
    ? posts.filter((post) =>
        post.content.toLowerCase().includes(delayQuery.toLowerCase()),
      )
    : [];

  return (
    <div className="">
      <section className="flex justify-center mt-3 px-10">
        <div className="flex border border-gray-300 h-10 w-full lg:w-150 rounded-lg overflow-hidden p-1">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 outline-none px-2"
          />
          <button
            className="px-2 rounded-br-md rounded-r-md cursor-pointer active:scale-98 bg-violet-700 text-white"
            onClick={() => setQuery("")}
          >
            cancle
          </button>
        </div>
      </section>
      <section className="p-5 overflow-y-scroll">
        {filteredPosts.map((post) => (
          <div key={post.id}>
            {post.content && (
              <div className="">
                <div className="flex gap-2">
                  <div className="size-10 border rounded-full overflow-hidden">
                    <img
                      src={post.profile_image}
                      alt="media"
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-bold">{post.username}</div>
                    <p className="text-gray-500 text-[10px] font-semibold font-mono">
                      {formatDate(post.created_at)}
                    </p>
                  </div>
                </div>
                <div className="px-12">
                  <div className="lg:w-85 w-80 whitespace-pre-wrap break-words text-sm">
                    {post.content}
                  </div>
                  {post.media_url && (
                    <div className="">
                      <img
                        src={post.media_url}
                        alt="media"
                        className="w-auto lg:w-120 max-w-80 max-h-80 h-auto rounded-lg"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-3 w-fit">
                    <Likes postId={post.id} />
                    <div className="flex items-center gap-1">
                      <CreateCommentPost
                        content={post.content}
                        postId={post.id}
                      />
                      <div>{post.comments_count}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default SearchPost;
