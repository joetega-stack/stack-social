"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { appContext } from "@/context/globalContext";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import CreatePost from "./createPost";



const Footer = () => {
  const pathname = usePathname();
    const { openPost, setOpenPost } = useContext(appContext);
  

  const links = [
    { href: "/signup", label: "create account" },
    { href: "/login", label: "signin" },
  ];
  return (
    <div className="fixed bottom-0 h-20 w-full flex items-center p-10 bg-white">
      <div>
        <div
        onClick={() => setOpenPost(!openPost)}
        className="absolute right-10 bottom-25 p-4 rounded-full bg-violet-700 border-2 border-white cursor-pointer"
      >
        {openPost ? "" : <HiOutlinePencilSquare className="text-white" size={25} />}
      </div>
      {openPost ? <CreatePost /> : ""}
      </div>
      <div className="text-3xl font-bold">logo</div>
      <div className="flex flex-1 justify-end gap-5">
        {links.map((link) => {
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors duration-300 text-black py-1 px-3 rounded-2xl ${pathname === link.href ? "bg-gray-100 " : "bg-violet-700 text-white"}`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Footer;
