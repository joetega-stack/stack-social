"use client";
import React, { useState, useContext, useEffect } from "react";
import { appContext } from "@/context/globalContext";
import { formatDate } from "@/utils/formatdate";
import Likes from "@/components/likes";
import CreateCommentPost from "../../components/createCommentPost";
import { CiCirclePlus } from "react-icons/ci";
import { GrStatusGood } from "react-icons/gr";
import { useRouter } from "next/navigation";
import MainFooter from "@/components/main-footer";



const SearchPost = () => {
  const { discoverPost, query, setQuery, users } = useContext(appContext);
    const router = useRouter()
  
    const filteredPosts = query
      ? discoverPost.filter((post) =>
          post.content.toLowerCase().includes(query.toLowerCase()),
        )
      : [];
  
    const filteredUsers = query
      ? (users ?? []).filter((user) =>
        (user.username ?? "").toLowerCase().includes(query.toLowerCase()) 
        )
      : [];

  return (
      <div className="">
      <section className="flex justify-center mt-5">
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
      <section className="mb-20">
        <section className="p-5">
        {filteredPosts.map((post) => {
          return (
            <div key={post.id}>
              {post.content && (
                <div className="lg:w-100 mt-3 border-b border-gray-300">
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
                    <div className="lg:w-85 w-80 whitespace-pre-wrap break-words text-sm">
                      {post.content}
                    </div>
                    {post.media_url && (
                      <div className="">
                        <img
                          src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${post.media_url}`}
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
          );
        })}
      </section>
      <section className="px-5">
        {filteredUsers.map((user) => {
          console.log("info",user.username, user.bio)
          return (
            <div key={user.id} className="flex">
              <div
                onClick={() => router.push(`/profile/${user.id}`)}
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
      </section>
      </section>
          <MainFooter/>
    </div>
  );
};

export default SearchPost;
