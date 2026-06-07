"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { appContext } from "@/context/globalContext";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import CreatePost from "./createPost";
import { IoHomeOutline,IoSearchOutline,IoPersonOutline } from "react-icons/io5";



const MainFooter = () => {
  const pathname = usePathname();
    const { openPost, setOpenPost,router } = useContext(appContext);
  

  const links = [
    { href: "/main-page", label: <IoHomeOutline /> },
    { href: "/search", label: <IoSearchOutline /> },
    { href: "/profile", label: <IoPersonOutline /> },
  ];
  return (
    <div className="fixed flex items-end justify-between bottom-0 h-40 w-full lg:w-full lg:hidden flex-col">
            <div className="mr-15">
              <div
              onClick={() => setOpenPost(!openPost)}
              className="p-4 rounded-full bg-violet-700 border-2 border-white cursor-pointer"
            >
              {openPost ? "" : <HiOutlinePencilSquare className="text-white" size={25} />}
            </div>
            {openPost ? <CreatePost /> : ""}
            </div>
      <div className="w-full flex border-t border-gray-300 h-20 items-center px-10 bg-zinc-50">
        <Link href={"/main-page"} className="lg:text-3xl w-[50%] text-2xl font-bold text-start font-mono text-violet-800">Social</Link >
      <div className="flex w-[50%] justify-between">
        {links.map((link) => {
          return (
            <Link
            key={link.href}
            href={link.href}
            className={`transition-colors duration-300 text-black text-2xl py-2 px-3 rounded-2xl ${pathname === link.href ? "bg-gray-100 " : "bg-violet-700 text-white"}`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      </div>
    </div>
  );
};

export default MainFooter;
