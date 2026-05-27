"use client";
import React, { useState,  useContext } from "react";
import { commentPost } from "@/utils/tasks";
import { FaRegCommentDots } from "react-icons/fa6";
import { appContext } from "@/context/globalContext";


const CreateCommentPost = ({ postId, content }) => {
  const [commentContent, setCommentContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const {count}= useContext(appContext)


  async function handleComment(e) {
    e.preventDefault();
    try {
      const res = await commentPost(postId, commentContent);
      console.log("count",res)
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
          <form onSubmit={handleComment} className=" w-120 h-70 p-5 bg-white rounded-lg">
            <div>
              <div className="flex justify-between px-2 *:h-10 *:px-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-blue-700"
                >
                  cancle
                </button>
                <button
                  className="bg-blue-300 rounded-2xl cursor-pointer active:scale-98"
                  type="submit"
                >
                  Reply
                </button>
              </div>
            </div>
            <div>
              <div>{console.log("content",content)}</div>
            </div>
            <div className="flex gap-2">
              <div className="size-12 border rounded-full text-center">img</div>
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
