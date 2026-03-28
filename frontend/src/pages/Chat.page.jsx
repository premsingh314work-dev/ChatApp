import React, { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore.js'

const ChatPage = () => {
  const {authUser,logout} = useAuthStore();
  useEffect(() => {
    console.log ("ChatPage authUser: ", authUser);
  }, [authUser]); 
  
  return (
    <>
    
    <div className='bg-slate-900 h-screen w-screen flex justify-center items-center p-1'>        
      
      <div className='bg-red-400 h-[90%] w-[80%] flex'>
        {/* Left side (LoggedInUser profile)(Chats | contacts) */}
        <div className='bg-[#1b2839] h-full w-[25%] flex flex-col'>
          {/* LoggedInuser profile */}
          <div className='bg- h-[15%] w-full border-b border-white/10'>

          </div>
          {/* div (chats|contact) */}
          <div className='w-full h-[10%] flex gap-5 justify-center items-center text-[#1c849b]'>
            <button className='bg-[#16495c] h-auto w-[50%] ml-5 p-1 rounded-xl cursor-pointer' type="button">Chats</button>
            <button className='bg-[#16495c] h-auto w-[50%] mr-5 p-1 rounded-xl cursor-pointer' type="button">Contacts</button>
          </div>
          {/* Other users */}
          <div className='bg-gray-400 w-full h-[75%]'>

          </div>


        </div>
        
        {/* Right side (selscted chats || Nothing to show  ) */}
        <div className='bg-amber-500 h-full w-[75%]'></div>


      </div>
  
    </div>
    </>
  )
}

export default ChatPage