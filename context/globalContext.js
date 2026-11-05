"use client";
import { useState, useEffect, useContext, createContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/utils/profile";
import { discover } from "@/utils/tasks";
import { getAllUsers } from "@/utils/profile";
import { getToken } from "@/lib/auth";


export const appContext = createContext({});

const AppcontextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openPost, setOpenPost] = useState(false);
  const [count, setCount] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [activeRight, setActiveRight] = useState(false);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState(null);
  const [discoverPost, setDiscoverPost]= useState([])
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  const router = useRouter()
  

  const toggleAside = () => {
    setActive((prev) => !prev);
  };

  const toggleRight = () => {
    setActiveRight((prev) => !prev);
  };

  useEffect(() => {
    async function loadDiscover() {
    try {
      const data = await discover()
      setDiscoverPost(data)
      console.log("discoverData",data)
    } catch(err) {
      console.error(err)
    }
    }
    loadDiscover()
  }, [])
  
   useEffect(() => {
     async function loadUsers() {
       
       const token = getToken()

       if (!token) return
       
        try {
          const res = await getAllUsers();
          const normalized = res.map((user) => ({
            ...user,
            isFollowing: user.is_following,
          }));
          setUsers(normalized);
        } catch (err) {
          console.error(err);
        }
      }
      loadUsers();
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
      toggleRight,posts, setPosts,username, setUsername, query, setQuery,router,discoverPost,setDiscoverPost,setUsers,users
    }),
    [
      error,
      loading,
      active,
      isOpen,
      openPost,
      count,
      openForm,
      openSettings,
      activeRight,posts,username,query,router,discoverPost,users
    ],
  );
  return <appContext.Provider value={values}>{children}</appContext.Provider>;
};

export default AppcontextProvider;
