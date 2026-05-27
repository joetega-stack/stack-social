'use client'
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Feed from "@/components/feed"
import Discover from "@/components/discover"
import { useSearchParams } from "next/navigation";


export default function Home() {
  const params = useSearchParams()

  const tab = params.get("tab") || "feed"
  
  return (
    <div className="bg-zinc-50">
      <Header />
      <div className="h-dvh">
        {tab === "feed" && <Feed/>}
        {tab === "discover" && <Discover/>}
      </div>
      <Footer/>
    </div>
  );
}
