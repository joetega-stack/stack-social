"use client";
import React, { useState, useRef, useContext, useEffect,Suspense } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useRouter } from "next/navigation";
import { appContext } from "@/context/globalContext";
import { FaTimes } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { RxPeople } from "react-icons/rx";

const HeaderContent = ({ scrollContainerId }) => {
  const router = useRouter();
  const params = useSearchParams();
  const [hideHeader, setHideHeader] = useState(false);
  const { active, toggleAside,activeRight,toggleRight } = useContext(appContext);

  const tab = params.get("tab") || "feed";
  const lastScroll = useRef(0);

  useEffect(() => {
    const scrollElement = scrollContainerId
      ? document.getElementById(scrollContainerId)
      : null;
    const scrollTarget = scrollElement ?? window;
    const getScrollPosition = () =>
      scrollTarget === window ? window.scrollY : scrollTarget.scrollTop;

    lastScroll.current = getScrollPosition();
    const handleScroll = () => {
      const currentScroll = getScrollPosition();
      const isScrollingDown = currentScroll > lastScroll.current;

      setHideHeader(isScrollingDown && currentScroll > 0);
      lastScroll.current = currentScroll;
    };

    scrollTarget.addEventListener("scroll", handleScroll, { passive: true });

    return () => scrollTarget.removeEventListener("scroll", handleScroll);
  }, [scrollContainerId]);

  return (
    <div
      className={`header ${hideHeader ? "hide" : ""} h-30 w-full flex flex-col px-3 justify-between border-b border-gray-400 bg-zinc-50`}
    >
      <div className="flex justify-between px-5 mt-3">
        <div className="cursor-pointer" onClick={toggleAside}>
        {active ? <FaTimes size={25} /> : <RxHamburgerMenu size={25} />}
      </div>
        <div onClick={toggleRight}>
          <RxPeople size={25} />
      </div>
      </div>
      <div className="group w-full h-10 *:w-[50%] *:hover:bg-gray-100 *:cursor-pointer flex justify-between *:flex *:justify-center *:items-baseline-last">
        <div onClick={() => router.push("?tab=discover")}>
        <button  className={`${tab === "discover" ? "border-b-4 border-violet-700 px-2":""}`}>Discover</button>
        </div>
        <div onClick={() => router.push("?tab=feed")}>
        <button className={`${tab === "feed" ? "border-b-4 border-violet-700 px-2" : ""}`}>Feed</button>
        </div>
      </div>
    </div>
  );
};

const Header = ({scrollContainerId}) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeaderContent scrollContainerId={scrollContainerId}/>
    </Suspense>
  )
}

export default Header;
