"use client";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Feed from "@/components/feed";
import { useSearchParams } from "next/navigation";
import { useContext, useState } from "react";
import { appContext } from "@/context/globalContext";
import Aside from "../../components/aside";
import Discover from "../../components/discover";
import FindFriends from "@/components/findFriends";


export default function Home() {
  const params = useSearchParams();
  const { active,activeRight } = useContext(appContext);

  const tab = params.get("tab") || "feed";

  return (
    <div className="flex flex-col w-full h-full">
      <Header />
      {active ? <Aside /> : ""}
      {activeRight ? <FindFriends/>: ""}
      <div id="main-feed-scroll" className="flex-1">
        {tab === "feed" && <Feed />}
        {tab === "discover" && <Discover />}
      </div>
      <Footer />
    </div>
  );
}
