"use client";
import React, { useContext, useEffect, useState } from "react";
import { formatDate } from "@/utils/formatdate";
import Likes from "@/components/likes";
import CreateCommentPost from "@/components/createCommentPost";
import { appContext } from "@/context/globalContext";
import { IoArrowBack } from "react-icons/io5";

const Discover = () => {
  const { publicF } = useContext(appContext);
  const [openPostId, setOpenPostId] = useState(null);

  return (
    <div className="p-5 mb-20">
      <div>
        {publicF ? 
          <div>
        {publicF.map((feed) => {
          console.log("feed", feed);
          const isOpen = openPostId === feed.id;
          const imageUrl = feed.media_url
            ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${feed.media_url}`
            : null;
          const profileImg = feed.profile_image
            ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${feed.profile_image}`
            : null;
          return (
            <div
              key={feed.id}
              className="border-b border-gray-300"
              onClick={() => setOpenPostId(isOpen ? null : feed.id)}
            >
              {openPostId === feed.id ? (
                <div
                  className="p-5 fixed top-0 left-0 w-full z-10 h-full bg-blue-50 overflow-scroll"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-5">
                    <button
                      className="border size-8 text-2xl rounded-full flex items-center justify-center bg-black/30 text-white cursor-pointer active:scale-98"
                      onClick={() => setOpenPostId(null)}
                    >
                      {" "}
                      <IoArrowBack />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <div className="size-10 border rounded-full mt-2 overflow-hidden">
                      <img
                        src={profileImg}
                        alt="profile"
                        className="size-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <div className="font-bold">{feed.username}</div>
                        <p className="text-gray-500 text-[13px]">
                          {formatDate(feed.updated_at ?? feed.created_at)}
                        </p>
                      </div>
                      <div>{feed.content}</div>
                      <div className=" mt-1">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="post media"
                            className="w-auto max-w-150 h-auto rounded-lg"
                          />
                        ) : null}
                      </div>
                      <div className="flex items-center gap-3 w-fit">
                        <Likes postId={feed.id} />
                        <CreateCommentPost
                          content={feed.content}
                          postId={feed.id}
                        />
                        <div>{feed.comments_count}</div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-400">
                    {feed?.comments?.map((item, idx) => {
                      return (
                        <div key={idx} className="flex gap-2">
                          <div className="border size-10 rounded-full mt-2 overflow-hidden">
                            <img
                              src={profileImg}
                              alt="profile"
                              className="size-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex gap-1 items-center">
                              <div className="font-bold">{item.username}</div>
                              <div className="text-gray-500 text-[13px]">
                                {formatDate(item.created_at)}
                              </div>
                            </div>
                            <div>{item.content}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 p-2 cursor-pointer">
                  <div className="size-10 border rounded-full mt-2 overflow-hidden">
                    <img
                      src={profileImg}
                      alt="profile"
                      className="size-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex gap-1 items-center">
                      <p className="font-bold">{feed.username}</p>
                      <p className="text-gray-500 text-[13px] mt-0.5">
                        {formatDate(feed.updated_at ?? feed.created_at)}
                      </p>
                    </div>
                    <div className="">{feed.content}</div>
                    <div className=" mt-1">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="post media"
                          className="w-auto max-w-150 h-auto rounded-lg"
                        />
                      ) : null}
                    </div>
                    <div className="flex items-center gap-3 w-fit">
                      <Likes postId={feed.id} />
                      <CreateCommentPost
                        content={feed.content}
                        postId={feed.id}
                      />
                      <div>{feed.comments_count}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
        : <div>Loading...</div>}
      </div>
    </div>
  );
};

export default Discover;
