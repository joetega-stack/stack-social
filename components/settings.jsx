"use client";
import React, { useContext, useState } from "react";
import { updatePrivacy } from "@/utils/profile";
import { selfDeleteAccount } from "@/utils/profile";
import { IoArrowBack } from "react-icons/io5";
import { appContext } from "@/context/globalContext";
import { MdDelete } from "react-icons/md";
import { getToken } from "@/lib/auth";


const Settings = () => {
    const { setOpenSettings } = useContext(appContext);
    const [togglePrivacy,setTogglePrivacy] = useState(false)
    const [mess,setMess] = useState("")
    
    async function handlePricacy() {
        try {
            const res = await updatePrivacy()
            console.log(res.message)
            setMess(res.message)

            setTimeout(() => {
              setMess("")  
            },3000)
        } catch(err) {
            console.error(err)
        }
    }

    async function handleDelete() {
        try {
            const res = await selfDeleteAccount()
        } catch(err) {
            console.error(err)
        }
    }
        
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center backdrop-blur-md">
      <div className="relative h-100 w-100 border bg-white rounded-xl p-5">
        <button
          onClick={() => setOpenSettings(false)}
          className="absolute w-8 h-8 bg-black/30 text-white font-bold text-2xl flex justify-center items-center rounded-full cursor-pointer active:scale-98"
        >
          <IoArrowBack />
        </button>
        <div className="flex items-center justify-between mt-15">
                  <p>Toggle privacy</p>
                  <div className="flex items-center gap-2">
                      <p className={`${togglePrivacy? "text-green-400":"text-gray-500"} text-[10px]`}>{togglePrivacy? "private":"public"}</p>
                  <button onClick={() => { handlePricacy(); setTogglePrivacy(!togglePrivacy)}} className="border border-gray-400 bg-gray-200 h-6 w-12 rounded-lg overflow-hidden relative cursor-pointer">
            <div className={`${togglePrivacy ? "left-[50%] bg-green-400":"left-0 bg-gray-500"} w-[50%] h-[100%] rounded-lg absolute top-0`}></div>
          </button>
                  </div>
        </div>
              <div className="flex justify-between items-center mt-5">
                  <p>Delete account</p>
                   <button className="text-2xl text-red-600 cursor-pointer" onClick={handleDelete}><MdDelete/></button>
              </div>
              <div className="absolute bottom-0 left-0 w-full text-center">{mess && <div className=""><p>{mess}</p></div>}</div>
      </div>
    </div>
  );
};

export default Settings;
