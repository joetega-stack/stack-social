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

  

  async function handleEdit(postId, content) {
    try {
      if (!content?.trim()) return;

      await updatePost(postId, content);
      setEditContent((prev) => ({ ...prev, [postId]: "" }));
      setEditPostId(null);
      fetchPost();
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
      <div className="flex flex-col gap-5">
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
                    <div className="font-bold">{post.username}</div>
                    <p className="text-gray-500 text-[13px]">
                      {formatDate(post.updated_at ?? post.created_at)}
                    </p>
                  </div>
                  <div className="px-12">{post.content}</div>
                  <div className="flex items-center gap-3 w-fit px-12">
                    <Likes postId={post.id} />
                    <div className="flex items-center gap-1">
                      <CreateCommentPost
                        content={post.content}
                        postId={post.id}
                      />
                      <div>{post.comments_count}</div>
                    </div>
                  </div>
                  <div className="px-5 pt-3 border-t border-gray-400">
                    {post?.comments?.map((item, idx) => {
                      return (
                        <div key={idx}>
                          <div className="flex items-center gap-2">
                            <div className="border size-10 rounded-full overflow-hidden">
                              <img
                                src={imageUrl}
                                alt="Profile"
                                className="size-full object-cover"
                              />
                            </div>
                            <div className="font-bold">{item.username}</div>
                            <div className="text-gray-500 text-[13px]">
                              {formatDate(item.created_at)}
                            </div>
                          </div>
                          <div className="px-12">{item.content}</div>
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
                      <p className="font-bold">{username}</p>
                      <p className="text-gray-500">
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
                  <div className="px-13">{post.content}</div>

                  <div className="flex gap-2 items-center">
                    <div className="flex items-center gap-2 pl-13">
                      <Likes postId={post.id} />
                      <div className="flex items-center gap-1">
                        <CreateCommentPost />
                        <p>{post.comments_count}</p>
                      </div>
                    </div>
                    {editPostId === post.id ? (
                      <div>
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
                          className="border border-gray-400 w-100 h-20 rounded-sm "
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
