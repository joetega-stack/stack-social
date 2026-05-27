"use client";
import React, { useState,useContext } from "react";
import { appContext } from "@/context/globalContext";

const SearchPost = () => {
  const {posts, setPosts}=useContext(appContext)

  const [query, setQuery] = useState("");

 

  const filteredPosts = query ? posts.filter((post) => 
    post.content.toLowerCase().includes(query.toLowerCase())
  ):[]

  return (
    <div>
      <section className="flex justify-center mt-3">
        <div
          className="flex border border-gray-300 h-10 w-150 rounded-lg overflow-hidden p-1"
        >
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 outline-none px-2"
          />
          <button className="px-2 rounded-br-md rounded-r-md cursor-pointer active:scale-98 bg-violet-700 text-white"
          onClick={()=>setQuery("")}>
            cancle
          </button>
        </div>
      </section>
      <section className="p-5">{
        filteredPosts.map((post) => {
          return <div key={post.id}>
            <div>{post.content || ""}</div>
          </div>
        })
      }</section>
    </div>
  );
};

export default SearchPost;
