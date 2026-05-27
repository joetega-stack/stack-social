"use client";
import React, { Suspense, useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import Link from "next/link";
import Feed from "@/components/feed";
import GetPosts from "@/components/getPosts";
import SearchPost from "@/components/searchPost";
import { useSearchParams, useRouter } from "next/navigation";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import CreatePost from "@/components/createPost";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { appContext } from "@/context/globalContext";
import { useContext } from "react";
import Upload from "@/components/upload";
import { updateUserProfile } from "@/utils/profile";
import { getCurrentUser } from "@/utils/profile";
import { getToken } from "@/lib/auth";
import EditProfile from "@/components/editProfile";
import Settings from "@/components/settings";


const ProfileContent = () => {
  const params = useSearchParams();
  const router = useRouter();
  const tab = params.get("tab") || "getPost";
  const [currentUser, setCurrentUser] = useState(null)
  const [images, setImages] = useState({
    profile_image: "",
    cover_photo: "",
  });
  const { openPost, setOpenPost, setError, openForm,setOpenForm,openSettings, setOpenSettings } = useContext(appContext);

    useEffect(() => {
      async function loadUser() {
        try {
          const token = getToken();
          console.log(token);
            if (!token) return
            
          const res = await getCurrentUser();
          setCurrentUser(res);
          
          console.log("res", res);
        } catch (err) {
          console.error("no current user", err);
        }
      }
      loadUser();
    }, []);

  const toImageSrc = (value) => {
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("blob:")) {
      return value;
    }

    const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/+$/, "");
    return base ? `${base}/${value.replace(/^\/+/, "")}` : value;
  };

  const handleImageUpload = async (field, key) => {
    setImages((prev) => ({ ...prev, [field]: key }));

    try {
      const payload = field === "cover_photo" ? { cover_photo: key } : { profile_image: key };
      const updatedUser = await updateUserProfile(payload);

      console.log("updated user",updatedUser)

      if (updatedUser && typeof updatedUser === "object") {
        setCurrentUser((prev) => ({ ...prev, ...updatedUser }));
      } else {
        setCurrentUser((prev) => ({ ...prev, [field]: key }));
      }
    } catch (err) {
      const message = err?.message || "Failed to update profile image";
      setError?.(message);
      console.error(message, err);
    }
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="bg-zinc-50" >
      <Link
        href={"/main-page"}
        className="absolute w-8 h-8 bg-black/30 text-white font-bold text-2xl flex justify-center items-center rounded-full m-2 cursor-pointer active:scale-98"
      >
        <IoArrowBack />
      </Link>
      <section className="h-40 bg-gray-200 text-center border-b border-gray-300">
        {currentUser.cover_photo ? (
          <img
            src={toImageSrc(currentUser.cover_photo)}
            alt="Cover"
            className="h-40 w-full object-cover"
          />
        ) : (
          <Upload
            value={images.cover_photo}
            onUpload={(key) => handleImageUpload("cover_photo", key)}
          />
        )}
      </section>
      <section className="relative flex justify-between px-5">
        {currentUser && (
          <div>
            <div className="absolute border border-gray-500 size-25 rounded-full top-[-50] overflow-hidden">
              {currentUser.profile_image ? (
              <img
                src={toImageSrc(currentUser.profile_image)}
                alt="Profile"
                className="size-full object-cover"
              />
            ) : (
              <Upload
                value={images.profile_image}
                onUpload={(key) => handleImageUpload("profile_image", key)}
              />
            )}
            </div>
            <p className="mt-15 text-3xl">{currentUser.username}</p>
            <p className="">{`@${currentUser.username}`}</p>
            <p>{currentUser.bio}</p>
            <div className="*:flex *:gap-2 flex gap-2">
              <Link href={"/follow?tab=followers"} className="cursor-pointer">
                followers <p className="font-bold">{currentUser.followers_count}</p>
              </Link>
              <Link href={"/follow?tab=following"}>
                following <p className="font-bold">{currentUser.following_count}</p>
              </Link>
            </div>
          </div>
        )}

        <div className="flex gap-3 items-start mt-2 *:cursor-pointer *:active:scale-98">
          <Link href={"/message"} className="size-8 bg-violet-700 text-white rounded-full flex justify-center items-center mr-10">
            <IoChatboxEllipsesOutline />
          </Link>
          <button
            type="button"
            className="py-1 px-2.5 rounded-2xl bg-violet-700 text-white"
            onClick={() => setOpenForm(true)}
          >
            Edit Profile
          </button>
          <button className="size-8 bg-violet-700 text-white rounded-full flex justify-center items-center"
          onClick={()=> setOpenSettings(!openSettings)}>
            <BsThreeDots />
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
          onClick={() => router.push("?tab=feed")}
          className={`${tab === "feed" ? "border-b-4 border-violet-700 px-2" : ""}`}
        >
          Feeds
        </button>
        <button
          onClick={() => router.push("?tab=search")}
          className={`${tab === "search" ? "border-b-4 border-violet-700 px-2" : ""}`}
        >
          Search
        </button>
      </section>
      <section>
        {tab === "getPosts" && <GetPosts />}
        {tab === "feed" && <Feed />}
        {tab === "search" && <SearchPost />}
      </section>
      <div
        onClick={() => setOpenPost(!openPost)}
        className="fixed right-10 bottom-10 p-4 rounded-full bg-violet-700 cursor-pointer"
      >
        {openPost ? "" : <HiOutlinePencilSquare className="text-white" size={25}/>}
      </div>
      {openForm ? <EditProfile /> : null}
      {openPost ? <CreatePost /> : null}
      {openSettings? <Settings/>: null}
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
