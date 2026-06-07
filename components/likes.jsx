"use client";
import React, { useState, useEffect } from "react";
import { likePost,getPostLikes } from "@/utils/tasks";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Likes = ({ postId }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    async function fetchLikes() {
      try {
        if (!postId) return
        const res = await getPostLikes(postId)
        setLiked(res.liked)
        setLikesCount(res.likes_count)
      } catch (err) {
        if (err?.message === "Post not found") {
          return
        }
      }
    }
    fetchLikes()
  },[postId])

 
    async function handleLike() {
    try {
      if (!postId) return 
      const res = await likePost(postId);
      setLiked(res.liked);
      setLikesCount(res.likes_count);
    } catch (err) {
      console.error("like Error", err?.message || err);
    }
  }

  return (
    <div className="w-fit">
      <div
        className="flex justify-between items-center gap-1 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          handleLike();
        }}
      >
        {liked ? <FaHeart color="red" /> : <FaRegHeart />}
        <span>{likesCount}</span>
      </div>
    </div>
  );
};

export default Likes;
