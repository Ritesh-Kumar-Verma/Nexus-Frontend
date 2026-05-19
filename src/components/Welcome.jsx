import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faBolt, faShieldHalved } from "@fortawesome/free-solid-svg-icons";

const Welcome = ({activeChat,currentUser}) => {
  return (
    <div className={`flex flex-col items-center justify-center h-full w-full bg-[#313338] text-[#DCDDDE] p-8 text-center rounded-lg ${activeChat.id ?"hidden" :"" } max-sm:hidden `}>
      
      {/* Icon Container */}
      <div className="bg-[#2B2D31] p-6 rounded-full mb-6 shadow-lg border border-[#1E1F22]">
        <FontAwesomeIcon icon={faComments} className="text-6xl text-[#5865F2]" />
      </div>

      {/* Greeting */}
      <h1 className="text-3xl font-bold mb-3 text-[#F2F3F5]">
        Welcome to Nexus{currentUser?.username ? `, ${currentUser.username}` : ""}!
      </h1>
      
      <p className="text-[#B5BAC1] max-w-md text-lg mb-10">
        You are successfully connected. Select a friend from the sidebar to start a secure, real-time conversation.
      </p>

      {/* Feature Badges */}
      <div className="flex gap-4 text-[#8E9297]">
        <div className="flex items-center gap-2 bg-[#2B2D31] px-4 py-2 rounded-xl text-sm font-medium shadow-sm">
          <FontAwesomeIcon icon={faBolt} className="text-yellow-500" /> 
          Real-time Sync
        </div>
        <div className="flex items-center gap-2 bg-[#2B2D31] px-4 py-2 rounded-xl text-sm font-medium shadow-sm">
          <FontAwesomeIcon icon={faShieldHalved} className="text-green-500" /> 
          Private 1-to-1
        </div>
      </div>

    </div>
  )
}

export default Welcome