"use client";
import React, { useEffect,useState } from "react";
import { sendMessage } from "@/utils/profile";
import { useParams,useRouter } from "next/navigation";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import { getMessages } from "@/utils/profile";
import { getCurrentUser } from "@/utils/profile";
import { formatDate } from "@/utils/formatdate";

const Page = () => {
  const { conversationId } = useParams();
  const router = useRouter()
  const [sendContent, setSendContent] = useState("")
  const [messages, setMessages] = useState([])
 const [me, setMe] = useState(null)

 
    async function handleMessage(e) {
      e.preventDefault()
      if (!sendContent.trim()) return
      try {
        const res = await sendMessage(conversationId,sendContent);
        console.log("message", res);
        setSendContent("")
      } catch (err) {
        console.error(err);
      }
  }

  useEffect(() => {
    async function loadMessages() {
      try {
        const res = await getMessages(conversationId)
        setMessages(res)
        console.log("messa",res)
      } catch (err) {
        console.error(err)
      }
    }
    loadMessages()
  }, [conversationId])

  useEffect(() => {

}, []);
  
  useEffect(() => {
   async function loadCurrentUser() {
    try {
      const res = await getCurrentUser()
      setMe(res.id)
    } catch (err) {
    console.error(err)}
    } 
    loadCurrentUser()
  })


  return (
    <div className="flex flex-col h-dvh">
      <div className="bg-gray-200">
        <div className="w-8 h-8 bg-black/30 text-white font-bold text-2xl flex justify-center items-center rounded-full m-2 cursor-pointer active:scale-98"
      onClick={()=> router.back()}>
        <IoArrowBack />
      </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 px-2">
          {messages.map((message) => {
            const isMine = message.sender.id === me

            return (
              <div key={message.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"} mt-2`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMine ? "bg-violet-600 text-white" : "bg-gray-200 text-black"}`}>
                  <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
                  <p className={`text-xs font-mono text-end mt-1 ${isMine ? "text-violet-100" : "text-gray-500"}`}>{formatDate(message.create_at)}</p>
                </div>
              </div>
            )
          })}
        </div>
        <form onSubmit={handleMessage} className="border-t border-gray-400 w-full flex items-center gap-2 p-3">
          <textarea value={sendContent} className="border border-gray-400 flex-1 outline-none p-1 rounded-sm"
          onChange={(e)=>setSendContent(e.target.value)}></textarea>
          <button type="submit" className="text-2xl text-violet-600 bg-gray-300 cursor-pointer active:scale-95 rounded-full size-10 flex items-center justify-center"><IoSend /></button>
        </form>
      </div>
    </div>
  );
};

export default Page;
