"use client";
import React, { useEffect, useState } from "react";
import { createPost } from "@/utils/tasks";
import { useContext } from "react";
import { appContext } from "@/context/globalContext";
import Upload from "@/components/upload";

const CreatePost = () => {
  const { loading, setLoading, setOpenPost } = useContext(appContext);
  const [content, setContent] = useState({
    textContent: "",
    media_url: "",
    visibility: "public",
  });

  async function handleCreatePost(e) {
    e.preventDefault();

    if (!content.textContent.trim() && !content.media_url) return;

    try {
      setLoading(true);
      await createPost({
        content: content.textContent,
        media_url: content.media_url,
        visibility: content.visibility,
      });
      setContent({
        textContent: "",
        media_url: "",
      });
      console.log("text",content.textContent)
      setOpenPost(false);
    } catch (err) {
      console.error("Post failed", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log("text",content.textContent)
  },[])

  return (
    <div className="fixed top-0 left-0 w-full h-full  flex items-center justify-center bg-white/30 backdrop-blur-lg">
      <form
        className="border w-150 p-5 rounded-2xl"
        onSubmit={handleCreatePost}
      >
        <div className="flex justify-between mb-2">
          <button
            onClick={() => setOpenPost(false)}
            className="bg-blue-200 px-2 py-1 rounded-sm cursor-pointer"
            type="button"
          >
            Cancle
          </button>
          <div>
            <button
              className="bg-blue-200 px-2 py-1 rounded-sm cursor-pointer"
              type="submit"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <div>profile-img</div>
          <textarea
            name="post"
            type="text"
            value={content.textContent}
            className="border flex-1 h-50 rounded-sm border-gray-400"
            onChange={(e) =>
              setContent((prev) => ({ ...prev, textContent: e.target.value }))
            }
          ></textarea>
        </div>
        <div className="border border-gray-400 size-10 rounded-full overflow-hidden">
          <Upload
            value={content.media_url}
            onUpload={(key) =>
              setContent((prev) => ({ ...prev, media_url: key }))
            }
          />
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
