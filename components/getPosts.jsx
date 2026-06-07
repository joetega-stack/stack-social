import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { appContext } from "@/context/globalContext";
import { updatePost, deletePost} from "@/utils/tasks";
import { formatDate } from "@/utils/formatdate";
import Likes from "@/components/likes";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import CreateCommentPost from "./createCommentPost";
import { IoArrowBack } from "react-icons/io5";

const GetPosts = () => {
  const { loading, setLoading,posts, setPosts,username } = useContext(appContext);
  const [editContent, setEditContent] = useState({});
  const [editPostId, setEditPostId] = useState(null);
  const [openPostId, setOpenPostId] = useState(null);

  const handleCommentCreated = (postId, response, submittedContent) => {
    const createdComment = response?.comment ?? response;
    const nextCount = response?.comments_count ?? response?.commentsCount;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        const comments = Array.isArray(post.comments) ? post.comments : [];
        const comment = {
          id:
            createdComment?.id ??
            createdComment?.comment_id ??
            `new-comment-${postId}-${Date.now()}`,
          username: createdComment?.username ?? username ?? "You",
          content: createdComment?.content ?? submittedContent,
          created_at: createdComment?.created_at ?? new Date().toISOString(),
        };

        return {
          ...post,
          comments: [...comments, comment],
          comments_count:
            typeof nextCount === "number"
              ? nextCount
              : (post.comments_count ?? comments.length) + 1,
        };
      }),
    );
  };

  async function handleEdit(postId, content) {
    try {
      if (!content?.trim()) return;

      await updatePost(postId, content);
      setEditContent((prev) => ({ ...prev, [postId]: "" }));
      setEditPostId(null);
      // fetchPost();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(postId) {
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      console.error(err);
    }
  }

 
  return (
    <div className="p-5">
      <div className="flex flex-col gap-5 mb-20">
        {posts.map((post) => {
          const isOpen = openPostId === post.id;
          const imageUrl = post.profile_image
            ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${post.profile_image}`
            : null;
          return (
            <div
              key={post.id}
              className="border-b border-gray-300 p-2"
              onClick={() => setOpenPostId(isOpen ? null : post.id)}
            >
              {openPostId === post.id ? (
                <div
                  className="p-2 fixed top-0 left-0 h-full w-full bg-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-5">
                    <button
                      className="border size-8 text-2xl rounded-full flex items-center justify-center bg-black/30 text-white cursor-pointer active:scale-98"
                      onClick={() => setOpenPostId(null)}
                    >
                      <IoArrowBack />
                    </button>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="size-10 border rounded-full overflow-hidden">
                      <img
                        src={imageUrl}
                        alt="Profile"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="font-bold font-serif">{post.username}</div>
                    <p className="text-gray-500 text-[10px] font-semibold font-mono">
                      {formatDate(post.updated_at ?? post.created_at)}
                    </p>
                  </div>
                  <div className="px-12 w-150 whitespace-pre-wrap break-words text-sm">{post.content}</div>
                  <div className="flex items-center gap-3 w-fit px-12">
                    <Likes postId={post.id} />
                    <div className="flex items-center gap-1">
                      <CreateCommentPost
                        content={post.content}
                        postId={post.id}
                        onCommentCreated={(response, submittedContent) =>
                          handleCommentCreated(
                            post.id,
                            response,
                            submittedContent,
                          )
                        }
                      />
                      <div>{post.comments_count}</div>
                    </div>
                  </div>
                  <div className="px-5 pt-3 border-t border-gray-400">
                    {post?.comments?.map((item) => {
                      return (
                        <div key={item.id}>
                          <div className="flex items-center gap-2">
                            <div className="border size-10 rounded-full overflow-hidden">
                              <img
                                src={imageUrl}
                                alt="Profile"
                                className="size-full object-cover"
                              />
                            </div>
                            <div className="font-bold font-serif">{item.username}</div>
                            <div className="text-gray-500 text-[10px] font-semibold font-mono">
                              {formatDate(item.created_at)}
                            </div>
                          </div>
                          <div className="px-12 w-150 whitespace-pre-wrap break-words text-sm">{item.content}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <div className="size-10 border rounded-full overflow-hidden">
                        <img
                        src={imageUrl}
                        alt="Profile"
                        className="size-full object-cover"
                      />
                      </div>
                      <p className="font-bold font-serif">{username}</p>
                      <p className="text-gray-500 text-[10px] font-semibold font-mono">
                        {formatDate(post.updated_at ?? post.created_at)}
                      </p>
                    </div>
                    <button
                      className="bg-red-300 px-2 cursor-pointer active:scale-98 rounded-md"
                      onClick={() => handleDelete(post.id)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                  <div className="px-13 w-150 whitespace-pre-wrap break-words text-sm">{post.content}</div>

                  <div className="flex gap-2 items-center">
                    <div className="flex items-center gap-2 pl-13">
                      <Likes postId={post.id} />
                      <div className="flex items-center gap-1">
                        <CreateCommentPost
                          content={post.content}
                          postId={post.id}
                          onCommentCreated={(response, submittedContent) =>
                            handleCommentCreated(
                              post.id,
                              response,
                              submittedContent,
                            )
                          }
                        />
                        <p>{post.comments_count}</p>
                      </div>
                    </div>
                    {editPostId === post.id ? (
                        <div className="z-10"
                        onClick={(e)=> e.stopPropagation()}>
                        <textarea
                          type="text"
                          placeholder="Edit post"
                          value={editContent[post.id] || ""}
                            onChange={(e) => {
                             
                            setEditContent({
                              ...editContent,
                              [post.id]: e.target.value,
                            });
                            e.stopPropagation();
                          }}
                          className="border border-gray-400 w-100 h-20 rounded-sm z-30"
                        />
                        <div className="flex gap-3">
                          <button
                            className="bg-blue-200 px-2 cursor-pointer active:scale-98 rounded-md"
                            onClick={(e) => {
                              handleEdit(post.id, editContent[post.id]);
                              e.stopPropagation();
                            }}
                          >
                            save
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              setEditPostId(null);
                              setEditContent((prev) => ({
                                ...prev,
                                [post.id]: "",
                              }));
                              e.stopPropagation();
                            }}
                            className="bg-blue-200 px-2 cursor-pointer active:scale-98 rounded-md"
                          >
                            cancle
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="bg-blue-200 px-2 cursor-pointer active:scale-98 rounded-md"
                        onClick={(e) => {
                          setEditPostId(post.id);
                          setEditContent({
                            ...editContent,
                            [post.id]: post.content,
                          });
                          e.stopPropagation();
                        }}
                      >
                        <FaEdit />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GetPosts;
