"use client";
import React, { Suspense, useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import Feed from "@/components/feed";
import GetPosts from "@/components/getPosts";
import SearchPost from "@/components/searchPost";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import CreatePost from "@/components/createPost";
import { appContext } from "@/context/globalContext";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { followUser } from "@/utils/profile";
import { useContext } from "react";
import Upload from "@/components/upload";
import { updateUserProfile } from "@/utils/profile";
import { getCurrentUser } from "@/utils/profile";
import { getUserProfile } from "@/utils/profile";
import EditProfile from "@/components/editProfile";
import Settings from "@/components/settings";
import { startChat } from "@/utils/profile";
import MainFooter from "@/components/main-footer";

const ProfilePage = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "getPosts";
  const profileId = params?.id;
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [userPosts, setUserPosts] = useState([]);

  const isOwnProfile =
    currentUser && Number(currentUser.id) === Number(profileId);

  const [images, setImages] = useState({
    profile_image: "",
    cover_image: "",
  });
  const {
    openPost,
    setOpenPost,
    setError,
    openForm,
    setOpenForm,
    openSettings,
    setOpenSettings,
  } = useContext(appContext);

  useEffect(() => {
    if (!profileId) return;

    async function loadProfile() {
      try {
        const [profileData, currentUserData] = await Promise.all([
          getUserProfile(profileId),
          getCurrentUser(),
        ]);

        setUser(profileData);
        setCurrentUser(currentUserData);
        setFriends(profileData);
      } catch (err) {
        console.error("no current user", err);
      }
    }
    loadProfile();
  }, [profileId]);

  async function handleFollow(profileId) {
    try {
      const res = await followUser(profileId);
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

  const handleImageUpload = async (field, imageUrl) => {
    try {
      const payload =
        field === "cover_image"
          ? { cover_image: imageUrl }
          : { profile_image: imageUrl };
      const updatedUser = await updateUserProfile(payload);

      console.log("updated user", updatedUser);

      setUser((prev) => ({ ...prev, ...updatedUser, [field]: imageUrl }));

      setImages((prev) => ({ ...prev, [field]: imageUrl }));
    } catch (err) {
      const message = err?.message || "Failed to update profile image";
      setError?.(message);
      console.error(message, err);
    }
  };

  async function startUserChat(targetUserId) {
    try {
      const res = await startChat(targetUserId);
      router.push(`/message/${res.conversation_id}`);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  }

  if (!user) return <div>Loading...</div>;

  return (
    <div className="bg-zinc-50">
      <div
        onClick={() => router.back()}
        className="absolute w-8 z-50 h-8 bg-black/30 text-white font-bold text-2xl flex justify-center items-center rounded-full m-2 cursor-pointer active:scale-98"
      >
        <IoArrowBack />
      </div>
      <section className="h-40 bg-gray-200 text-center border-b border-gray-300">
        {isOwnProfile ? (
          <Upload
            type="cover_image"
            value={images.cover_image || user.cover_image}
            onUpload={(url) => handleImageUpload("cover_image", url)}
          />
        ) : user.cover_image ? (
          <img
            src={user.cover_image}
            alt="Cover"
            className="size-full object-cover"
          />
        ) : null}
      </section>
      <section className="relative flex justify-between px-5">
        {user && (
          <div>
            <div className="absolute border border-gray-500 size-25 rounded-full top-[-50] overflow-hidden">
              {isOwnProfile ? (
                <Upload
                  type={"profile_image"}
                  value={images.profile_image || user.profile_image}
                  onUpload={(url) => handleImageUpload("profile_image", url)}
                />
              ) : user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt="Profile"
                  className="size-full object-cover"
                />
              ) : null}
            </div>
            <p className="mt-15 text-xl font-semibold lg:text-3xl font-serif">{user.username}</p>
            <p className="">{`@${user.username}`}</p>
            <p>{user.bio}</p>
            <div className="*:flex *:gap-2 flex gap-2">
              <div
                onClick={() => router.push(`/follow/${user.id}?tab=followers`)}
                className="cursor-pointer"
              >
                followers{" "}
                <p className="font-semibold">{user.followers_count}</p>
              </div>
              <div
                onClick={() => router.push(`/follow/${user.id}?tab=following`)}
                className="cursor-pointer"
              >
                following{" "}
                <p className="font-semibold">{user.following_count}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 items-start mt-2">
          <div>
            {isOwnProfile ? (
              <div className="flex mt-2 gap-3">
                <button
                  type="button"
                  className="py-1 lg:px-2.5 lg:w-25 w-20 rounded-2xl bg-violet-700 text-white"
                  onClick={() => setOpenForm(true)}
                >
                  Edit Profile
                </button>
                <button
                  className="size-8 bg-violet-700 text-white rounded-full flex justify-center items-center"
                  onClick={() => setOpenSettings(!openSettings)}
                >
                  <BsThreeDots />
                </button>
              </div>
            ) : (
              <div className="flex mt-2">
                <button
                  onClick={() => startUserChat(friends.id)}
                  className="size-8 cursor-pointer active:scale-98 bg-violet-700 text-white rounded-full flex justify-center items-center mr-10"
                >
                  <IoChatboxEllipsesOutline />
                </button>
                <button
                  type="button"
                  className="py-1 cursor-pointer active:scale-98 px-2.5 rounded-2xl bg-violet-700 text-white"
                  onClick={() => handleFollow(friends.id)}
                >
                  {friends.is_following ? "following" : "follow"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="border-b border-gray-300 flex w-full justify-center gap-5 mt-5 *:cursor-pointer">
        <button
          onClick={() => {
            user && router.push(`${user.id}?tab=getPosts`);
          }}
          className={`${tab === "getPosts" ? "border-b-4 border-violet-700 px-2" : ""}`}
        >
          Posts
        </button>
        {isOwnProfile && (
          <button
            onClick={() => {
              user && router.push(`${user.id}?tab=feed`);
            }}
            className={`${tab === "feed" ? "border-b-4 border-violet-700 px-2" : ""}`}
          >
            Feeds
          </button>
        )}
        <button
          onClick={() => router.push("?tab=search")}
          className={`${tab === "search" ? "border-b-4 border-violet-700 px-2" : ""}`}
        >
          Search
        </button>
      </section>
      <section>
        {tab === "getPosts" && (
          <GetPosts userPosts={userPosts} setUserPosts={setUserPosts} />
        )}
        {tab === "feed" && <Feed />}
        {tab === "search" && <SearchPost posts={userPosts} />}
      </section>
      <MainFooter />
      {openForm ? <EditProfile /> : null}
      {openPost ? <CreatePost /> : null}
      {openSettings ? <Settings /> : null}
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfilePage />
    </Suspense>
  );
}
