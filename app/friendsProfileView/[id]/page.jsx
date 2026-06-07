"use client";
import React, { useEffect, useState } from "react";
import { getUserProfile } from "@/utils/profile";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import Upload from "@/components/upload";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { getFriendPosts } from "@/utils/tasks";
import { startChat } from "@/utils/profile";
import { followUser } from "@/utils/profile";
import { formatDate } from "@/utils/formatdate";
import { useContext } from "react";
import { appContext } from "@/context/globalContext";
import Likes from "@/components/likes";
import MainFooter from "@/components/main-footer";

const Page = () => {
  const { id } = useParams();
  const params = useSearchParams();
  const tab = params.get("tab") || "getPost";
  const [friends, setFriends] = useState([]);
  const [friendPost, setFriendPost] = useState([]);
  const { query, setQuery,router } = useContext(appContext);

  useEffect(() => {
    async function loadFriendProfile() {
      try {
        const res = await getUserProfile(id);
        console.log("userid", res);
        setFriends(res);
      } catch (err) {
        console.error(err);
      }
    }
    if (id) {
      loadFriendProfile();
    }
  }, [id]);

  useEffect(() => {
    async function loadFriendPost() {
      try {
        const res = await getFriendPosts(id);
        setFriendPost(res);
        console.log("friend", res);
      } catch (err) {
        console.error(err);
      }
    }
    loadFriendPost();
  }, [id]);

  async function startUserChat(targetUserId) {
    try {
      const res = await startChat(targetUserId);
      router.push(`/message/${res.conversation_id}`);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleFollow(id) {
    try {
      const res = await followUser(id);
      setFriends((prev) => ({
        ...prev,
        is_following: res.is_following,
        followers_count:
          res.target_user?.followers_count ?? prev.followers_count,
      }));
    } catch (err) {
      console.error(err);
    }
  }

  const filteredPosts = query
    ? friendPost.filter((post) =>
        post.content.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  return (
    <div>
      <div
        onClick={()=> router.back()}
        className="absolute w-8 h-8 bg-black/30 text-white font-bold text-2xl flex justify-center items-center rounded-full m-2 cursor-pointer active:scale-98"
      >
        <IoArrowBack />
      </div>
      <section className="h-40 bg-gray-200 text-center border-b border-gray-300">
        {friends.cover_photo && (
          <img
            src={toImageSrc(friends.cover_photo)}
            alt="Cover"
            className="h-40 w-full object-cover"
          />
        )}
      </section>
      <section className="relative flex justify-between px-5">
        {friends && (
          <div>
            <div className="absolute border border-gray-500 size-25 rounded-full top-[-50] overflow-hidden">
              {friends.profile_image && (
                <img
                  src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${friends.profile_image}`}
                  alt="Profile"
                  className="size-full object-cover"
                />
              )}
            </div>
            <p className="mt-15 text-3xl font-serif">{friends.username}</p>
            <p className="">{`@${friends.username}`}</p>
            <p>{friends.bio}</p>
            <div className="*:flex *:gap-2 flex gap-2">
              <Link href={"/follow?tab=followers"} className="cursor-pointer">
                followers <p className="font-semibold">{friends.followers_count}</p>
              </Link>
              <Link href={"/follow?tab=following"}>
                following <p className="font-semibold">{friends.following_count}</p>
              </Link>
            </div>
          </div>
        )}

        <div className="flex gap-3 items-start mt-2 *:cursor-pointer *:active:scale-98">
          <button
            onClick={() => startUserChat(friends.id)}
            className="size-8 bg-violet-700 text-white rounded-full flex justify-center items-center mr-10"
          >
            <IoChatboxEllipsesOutline />
          </button>
          <button
            type="button"
            className="py-1 px-2.5 rounded-2xl bg-violet-700 text-white"
            onClick={() => handleFollow(friends.id)}
          >
            {friends.is_following ? "following" : "follow"}
          </button>
        </div>
      </section>
      <section className="border-b border-gray-300 flex w-full justify-center gap-5 mt-5 *:cursor-pointer">
        <button
          onClick={() => router.push("?tab=getPosts")}
          className={`${tab === "getPosts" ? "border-b-4 border-violet-700 px-2" : ""}`}
        >
          Posts
        </button>
        <button
          onClick={() => router.push("?tab=search")}
          className={`${tab === "search" ? "border-b-4 border-violet-700 px-2" : ""}`}
        >
          Search
        </button>
      </section>
      {tab === "getPosts" && (
        <section className="mb-25">
          <div>
            {friendPost.map((item) => {
              console.log("oop", item);
              return (
                <div
                  key={item.id}
                  className="w-full border-b border-gray-300 px-5 mt-3"
                >
                  <div className="flex gap-2">
                    <div className="size-10 border rounded-full overflow-hidden">
                      <img
                        src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${item.profile_image}`}
                        alt="media"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-bold">{item.username}</div>
                      <p className="text-gray-500 text-[10px] font-semibold font-mono">
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="px-12">
                    <div className="w-150 whitespace-pre-wrap break-words text-sm">{item.content}</div>
                    {item.media_url && (
                      <div className="">
                        <img
                          src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${item.media_url}`}
                          alt="media"
                          className="max-h-100 max-w-100 object-cover rounded-xl"
                        />
                      </div>
                    )}

                    <div>
                      <Likes postId={item.id}/>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {tab === "search" && (
        <section className="flex justify-center items-center mt-3 flex-col mb-25">
          <div className="flex border border-gray-300 h-10 w-150 rounded-lg overflow-hidden p-1">
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
          <section className="p-5">
            {filteredPosts.map((post) => {
              return (
                <div key={post.id} className="w-182">
                  <div>
                    {post.content && (
                      <div>
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
                          <div className="w-150 whitespace-pre-wrap break-words text-sm">{post.content}</div>
                          {post.media_url && (
                            <div className="">
                              <img
                                src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${post.media_url}`}
                                alt="media"
                                className="h-80 object-cover"
                              />
                            </div>
                          )}

                          <div>{post.likes_count}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        </section>
          )}
          <MainFooter/>
    </div>
  );
};

export default Page;
