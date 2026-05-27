"use client";
import { useState, useEffect, useContext, createContext, useMemo } from "react";
import { publicFeed } from "@/utils/tasks";
import { getDecodedToken } from "@/lib/auth";
import { getUserPosts } from "@/utils/tasks";

export const appContext = createContext({});

const AppcontextProvider = ({ children }) => {
  const [like, setLike] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [publicF, setPublicF] = useState([]);
  const [openPost, setOpenPost] = useState(false);
  const [count, setCount] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [activeRight, setActiveRight] = useState(false);
  const [posts, setPosts] = useState([]);
    const [username, setUsername] = useState(null);
  

  const toggleAside = () => {
    setActive((prev) => !prev);
  };

  const toggleRight = () => {
    setActiveRight((prev) => !prev);
  };

  useEffect(() => {
    async function loadFeed() {
      try {
        const res = await publicFeed();
        console.log("public", res);
        setPublicF(res);
      } catch (err) {
        console.error(err);
      }
    }

    loadFeed();
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchPost() {
      const user = getDecodedToken();

      if (!user?.id) {
        setPosts([]);
        setUsername(null);
        return;
      }

      setLoading(true);
      try {
        const data = await getUserPosts(user.id);
        if (!isMounted) return;
        setPosts(data);
        setUsername(user.username ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchPost();

    return () => {
      isMounted = false;
    };
  }, []);

  const values = useMemo(
    () => ({
      loading,
      setLoading,
      error,
      setError,
      active,
      toggleAside,
      isOpen,
      setIsOpen,
      publicF,
      setPublicF,
      openPost,
      setOpenPost,
      count,
      setCount,
      openForm,
      setOpenForm,
      openSettings,
      setOpenSettings,
      activeRight,
      setActiveRight,
      toggleRight,posts, setPosts,username, setUsername
    }),
    [
      error,
      loading,
      active,
      isOpen,
      publicF,
      openPost,
      count,
      openForm,
      openSettings,
      activeRight,posts,username
    ],
  );
  return <appContext.Provider value={values}>{children}</appContext.Provider>;
};

export default AppcontextProvider;
