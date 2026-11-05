"use client";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Feed from "@/components/feed";
import { useSearchParams } from "next/navigation";
import { Suspense, useContext, useState } from "react";
import { appContext } from "@/context/globalContext";
import Aside from "../../components/aside";
import Discover from "../../components/discover";
import FindFriends from "@/components/findFriends";
import MainFooter from "@/components/main-footer";
import SearchPost from "@/components/generalSearch";

function MainPageContent() {
  const searchParams = useSearchParams();
  const { active, activeRight } = useContext(appContext);

  const tab = searchParams.get("tab") || "feed";
  return (
    <div className="flex flex-col w-full h-full bg-zinc-50">
      <div className="lg:hidden">
        <Header />
        {active ? <Aside /> : ""}
        {activeRight ? <FindFriends /> : ""}
        <div id="main-feed-scroll" className="flex-1">
          {tab === "feed" && <Feed />}
        {tab === "discover" && <Discover />}
        </div>
        {/* <Footer /> */}
        <MainFooter />
      </div>
      <div className="hidden lg:flex h-dvh w-dvw">
        <div className="w-110">
          <Aside />
        </div>
        <div className="lg:w-160">
          <Header />
          <div>
            <div id="main-feed-scroll" className="flex-1">
              {tab === "feed" && <Feed />}
              {tab === "discover" && <Discover />} 
            </div>
          </div>
        </div>
        {activeRight ? <FindFriends /> : ""}
        <SearchPost />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-full w-full" />}>
      <MainPageContent />
    </Suspense>
  );
}
