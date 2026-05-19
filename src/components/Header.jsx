import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
const Header = ({currentUser,activeChat,setActiveChat,setMessages}) => {
  const handleBack=()=>{
    setActiveChat({})
    setMessages([])

  }
  return (
    <div className={`glass-header ${activeChat?.id ? "" :"hidden"}  flex  h-16 w-full  gap-2 items-center`}>
        
        {activeChat?.id && <FontAwesomeIcon icon={faAngleLeft} className={`  ml-2 text-2xl py-2 px-1 rounded-lg hover:bg-gray-600 hover:cursor-pointer`} style={{color: "#D1D5DB"}}
         onClick={handleBack}
        />}


<div className='flex justify-between w-full pr-2'>


        <div className='text-xl text-white '>{activeChat && activeChat.id ? activeChat.username : ""}</div>


        <div className=' bg-green-400 border-2 text-white px-2 rounded-lg '>{currentUser.username}</div>
        
</div>
        


        </div>
  )
}

export default Header