"use client";
import React, { useContext, useState } from "react";
import { formatDate } from "@/utils/formatdate";
import Likes from "@/components/likes";
import CreateCommentPost from "@/components/createCommentPost";
import { appContext } from "@/context/globalContext";
import { IoArrowBack } from "react-icons/io5";

const Discover = () => {
  const { publicF, setPublicF } = useContext(appContext);
  const [openPostId, setOpenPostId] = useState(null);

  const handleCommentCreated = (postId, response, submittedContent) => {
    const createdComment = response?.comment ?? response;
    const nextCount = response?.comments_count ?? response?.commentsCount;

    setPublicF((prev) =>
      prev.map((feed) => {
        if (feed.id !== postId) return feed;

        const comments = Array.isArray(feed.comments) ? feed.comments : [];
        const comment = {
          id:
            createdComment?.id ??
            createdComment?.comment_id ??
            `new-comment-${postId}-${Date.now()}`,
          username: createdComment?.username ?? "You",
          content: createdComment?.content ?? submittedContent,
          created_at: createdComment?.created_at ?? new Date().toISOString(),
        };

        return {
          ...feed,
          comments: [...comments, comment],
          comments_count:
            typeof nextCount === "number"
              ? nextCount
              : (feed.comments_count ?? comments.length) + 1,
        };
      }),
    );
  };

  return (
    <div className="p-5 mb-20 lg:z-50">
      <div>
        {publicF ? (
          <div className="">
            {publicF.map((feed, index) => {
              const isOpen = openPostId === feed.id;
              const feedKey =
                `${feed.id ?? feed.post_id ?? `${feed.username}-${feed.created_at}`}-${index}`;
              const imageUrl = feed.media_url
                ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${feed.media_url}`
                : null;
              const profileImg = feed.profile_image
                ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${feed.profile_image}`
                : null;
              return (
                <div
                  key={feedKey}
                  className="border-b border-gray-300"
                  onClick={() => setOpenPostId(isOpen ? null : feed.id)}
                >
                  {openPostId === feed.id ? (
                    <div
                      className="p-5 fixed top-0 left-0 z-10 h-full bg-zinc-50 overflow-scroll lg:w-150 lg:border-r border-gray-300"
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
                            <p className="text-gray-500 text-[10px] font-semibold font-mono">
                              {formatDate(feed.updated_at ?? feed.created_at)}
                            </p>
                          </div>
                          <div className="w-85 lg:w-120 whitespace-pre-wrap break-words text-sm border">{feed.content}</div>
                          <div className=" mt-1">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt="post media"
                                className="w-auto lg:w-120 max-w-80 max-h-80 rounded-lg"
                              />
                            ) : null}
                          </div>
                          <div className="flex items-center gap-3 w-fit">
                            <Likes postId={feed.id} />
                            <CreateCommentPost
                              content={feed.content}
                              postId={feed.id}
                              onCommentCreated={(response, submittedContent) =>
                                handleCommentCreated(
                                  feed.id,
                                  response,
                                  submittedContent,
                                )
                              }
                            />
                            <div>{feed.comments_count}</div>
                          </div>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-gray-400 lg:w-150">
                        {feed?.comments?.map((item, index) => {
                          const commentKey =
                            `${item.id ?? item.comment_id ?? `${feedKey}-${item.username}-${item.created_at}`}-${index}`;

                          return (
                            <div key={commentKey} className="flex gap-2 lg:w-141">
                              <div className="border size-10 rounded-full mt-2 overflow-hidden">
                                <img
                                  src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${item.profile_image}`}
                                  alt="profile"
                                  className="size-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="flex gap-1 items-center">
                                  <div className="font-bold">
                                    {item.username}
                                  </div>
                                  <div className="text-gray-500 text-[10px] font-semibold font-mono">
                                    {formatDate(item.created_at)}
                                  </div>
                                </div>
                                <div className="w-150 lg:w-120 whitespace-pre-wrap break-words text-sm">{item.content}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 p-2 cursor-pointer lg:w-150">
                      <div className="size-10 border rounded-full mt-2 overflow-hidden">
                        <img
                          src={profileImg}
                          alt="profile"
                          className="size-full object-cover"
                        />
                      </div>

                      <div>
                        <div className="flex gap-1 items-center">
                          <p className="font-bold font-serif">{feed.username}</p>
                          <p className="text-gray-500 text-[10px] font-semibold mt-0.5 font-mono">
                            {formatDate(feed.updated_at ?? feed.created_at)}
                          </p>
                        </div>
                        <div className="lg:w-120 w-80 whitespace-pre-wrap break-words text-sm">{feed.content}</div>
                        <div className=" mt-1">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt="post media"
                              className="w-auto lg:w-120 max-w-80 max-h-80 h-auto rounded-lg"
                            />
                          ) : null}
                        </div>
                        <div className="flex items-center gap-2 w-fit">
                          <Likes postId={feed.id} />
                          <CreateCommentPost
                            content={feed.content}
                            postId={feed.id}
                            onCommentCreated={(response, submittedContent) =>
                              handleCommentCreated(
                                feed.id,
                                response,
                                submittedContent,
                              )
                            }
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
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default Discover;
