'use client'
import React,{useContext, useEffect, useState} from 'react'
import { GrConnect } from "react-icons/gr";
import { appContext } from '@/context/globalContext';
import { getAllUsers } from '@/utils/profile';
import { CiCirclePlus } from "react-icons/ci";
import { followUser } from '@/utils/profile';
import { GrStatusGood } from "react-icons/gr";

const FindFriends = () => {
  const { toggleRight } = useContext(appContext)
  const [users,setUsers] = useState([])
  
  useEffect(() => {
    async function loadUsers() {
    try {
      const res = await getAllUsers()
      setUsers(res)
      console.log(res)
    } catch(err) {
      console.error(err)
    }
    }
    loadUsers()
  }, [])
  
  async function handleFollow(id) {
    try {
      await followUser(id)

      setUsers((prev) => prev.map((user)=> user.id === id ? {...user,isFollowing: true} : user))

    } catch(err) {
      console.error(err)
    }
  }

  return (
    <div className='fixed top-0 right-0 w-full h-full' onClick={toggleRight}>
      <div className='absolute top-0 right-0 h-full w-90 p-5 bg-blue-700'
        onClick={(e) => e.stopPropagation()}>
        <span className='absolute insert-x-0 top-0 left-0 h-full w-full bg-white/5 blur'></span>
      <div className='flex border-b-2 border-gray-400 justify-center items-center gap-2'>
        <h1 className='text-center text-2xl'>Find Friends</h1><GrConnect />
        </div>
        
        <div className='mt-3'>
          {users && users.map((user) => {
            return <div key={user.id} className='flex justify-between items-center border-b border-gray-400 p-2'>
              <div className='flex gap-2 '>
                <div className='border size-10 rounded-full mt-1'>{user.profile_image}</div>
              <div>
                <p className='font-bold'>{`@${user.username}`}</p>
              <p>{user.bio}</p>
              </div>
              </div>
              <button
                onClick={() => handleFollow(user.id)}
                // disabled={user.isFollowing || loa}
                className='cursor-pointer active:scale-98'>{user.isFollowing ? <GrStatusGood size={25}/>: <CiCirclePlus size={25} />}</button>
            </div>
          })}
        </div>
    </div>
    </div>
  )
}

export default FindFriends