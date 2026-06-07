"use client";
import React, { useState, useContext } from "react";
import { appContext } from "@/context/globalContext";
import { formatDate } from "@/utils/formatdate";
import { IoArrowBack } from "react-icons/io5";
import MainFooter from "@/components/main-footer";


const SearchPost = () => {
  const { posts, setPosts, query, setQuery,router } = useContext(appContext);

  const filteredPosts = query
    ? posts.filter((post) =>
        post.content.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  return (
      <div>
           <div className="w-8 h-8 bg-black/30 text-white font-bold text-2xl flex justify-center items-center rounded-full m-2 cursor-pointer active:scale-98"
                onClick={()=> router.back()}>
                  <IoArrowBack />
                </div>
      <section className="flex justify-center mt-3">
        <div className="flex border border-gray-300 h-10 lg:w-150 w-90 rounded-lg overflow-hidden p-1">
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
      <section className="p-5">
        {filteredPosts.map((post) => {
          return (
            <div key={post.id}>
              {post.content && (
                <div>
                  <div className="flex gap-2">
                    <div className="size-10 border rounded-full overflow-hidden">
                      <img
                        src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${post.profile_image}`}
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
                    <div className="w-85 lg:w-120 whitespace-pre-wrap break-words text-sm">
                      {post.content}
                    </div>
                    {post.media_url && (
                      <div className="">
                        <img
                          src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${post.media_url}`}
                          alt="media"
                          className="w-auto lg:w-120 max-w-80 max-h-80 rounded-lg"
                        />
                      </div>
                    )}

                    <div>{post.likes_count}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
          </section>
          <MainFooter/>
    </div>
  );
};

export default SearchPost;
