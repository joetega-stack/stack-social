"use client";
import React, { useState } from "react";
import { commentPost } from "@/utils/tasks";
import { FaRegCommentDots } from "react-icons/fa6";


const CreateCommentPost = ({ postId, content, onCommentCreated }) => {
  const [commentContent, setCommentContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  async function handleComment(e) {
    e.preventDefault();
    if (!postId || !commentContent.trim()) return;

    try {
      const submittedContent = commentContent.trim();
      const res = await commentPost(postId, submittedContent);
      onCommentCreated?.(res, submittedContent);
      setCommentContent("");
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="cursor-pointer">
      {isOpen ? (
        <div className="fixed z-10 bg-black/30 backdrop-blur-lg h-full w-full top-0 left-0 flex justify-center items-center"
        onClick={(e)=>e.stopPropagation()}>
          <form onSubmit={handleComment} className=" lg:w-120 w-100 p-5 bg-white rounded-lg">
            <div>
              <div className="flex justify-between *:h-10 *:px-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-white bg-violet-700 rounded-xl"
                >
                  cancle
                </button>
                <button
                  className="text-white bg-violet-700 rounded-xl cursor-pointer active:scale-98"
                  type="submit"
                >
                  Reply
                </button>
              </div>
            </div>
            <div>
              <div className="">{content}</div>
            </div>
            <div className="flex gap-2">
              <textarea
                name="text"
                value={commentContent}
                id=""
                onChange={(e) => setCommentContent(e.target.value)}
                className="flex-1 h-50 border border-gray-300 outline-none p-2 rounded-lg"
              ></textarea>
            </div>
          </form>
        </div>
      ) : (
          <div className="flex items-center gap-2 z-10"
          onClick={(e) => { setIsOpen((prev) => !prev); e.stopPropagation()}} >
            <FaRegCommentDots/>
        </div>
      )}
    </div>
  );
};

export default CreateCommentPost;
