import React, { useEffect, useState } from "react";
import assets from "../assets/assets";
import FloatingUserMenu from "./FloatingUserMenu";
import { friendsAPI } from "../api/service";
import { toast } from "react-toastify";
import Toast from "./Toast";
const Sidebar = ({ user, setUser, serverList, activeChat, setActiveChat }) => {
  const handleChat = (user) => {
    // console.log("user=",user)
    setActiveChat(() => user);
  };
  const [isSearchFocused, setIsSearchFocused] = useState();
  const [searchList, setSearchList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [friendRequestList, setFriendRequestList] = useState([]);
  const [friendsList, setFriendsList] = useState([]);

  const handleSearchKeydown = async (event) => {
    if (event.key == "Enter") {
      try {
        const res = await friendsAPI.search(searchKeyword);
        // console.log(res.data)
        setSearchList(() => res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    handleGetFriendRequest();
    handleGetFriendList();
  }, []);

  const handleGetFriendList = async () => {
    try {
      const res = await friendsAPI.getFriendList();
      // console.log("Friends:====",res.data)
      setFriendsList(() => res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendRequest = async (receiver) => {
    try {
      const res = await friendsAPI.sendRequest(receiver);
      toast.success(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetFriendRequest = async () => {
    try {
      const res = await friendsAPI.getRequest();
      setFriendRequestList((prev) => res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAcceptRequest = async (username) => {
    try {
      const response = await friendsAPI.acceptFriendRequest(username);
      handleGetFriendRequest()
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={` bg-transparent w-80 shrink-0  relative flex  max-sm:w-full  ${activeChat?.id ? "max-sm:hidden " : ""} 
       glass-sidebar
      `}
    >
      <Toast />
      <FloatingUserMenu user={user} setUser={setUser} />

      {/* Server selector */}

      <div
        className={` flex flex-col gap-4  w-16 bg-[#1a1525u] pt-3 px-3 max-sm:hidden border-r border-white/30 ${activeChat?.id ? "" : ""}`}
      >
        <div className=" h-10 w-10">
          <img src={assets.Nexus} className="" alt="" />
        </div>

        {serverList.map((data, index) => (
          <div
            key={index}
            className={` max-sm:hidden ${activeChat?.id ? "" : ""}`}
          >
            <img
              src={data.icon}
              alt=""
              className="rounded-xl hover:cursor-pointer "
            />
          </div>
        ))}
      </div>

      <div className="  w-full  h-full flex flex-col  items-center   max-sm:w-full  max-sm:items-end ">
        {/* Logo */}
        {/* <div className="text-2xl border  rounded-xl px-2 py-1 w-full flex gap-2">
        <img src={assets.Nexus} className="h-8   " alt="" />
        <h1>Nexus</h1>
      </div> */}

        {/* Search Box */}
        <div className="h-15 border-2 w-full flex items-center border-b border-white/30 px-3">

        <div className=" flex items-center border rounded-md border-[#4A3153] relative max-sm:w-full bg-[#1A1A24]  justify-between ">
          <div className="flex w-full justify-start items-center">
            <div className=" h-10 w-10 sm:hidden">
              <img src={assets.Nexus} className="" alt="" />
            </div>
            <img src={assets.search} alt="" />
            <input
              type="text"
              placeholder="Search..."
              className=" max-sm:w-5/7  w-full rounded-lg  focus:outline-0 h-8 p-2 text-xl   text-[#DCDDDE] placeholder:text-[#DCDDDE] "
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => setSearchKeyword(e.target.value.trim())}
              onKeyDown={handleSearchKeydown}
              value={searchKeyword}
              />
          </div>
          <button
            className="text-gray-400 font-bold hover:bg-gray-600 border   rounded-full mr-1 flex items-center justify-center"
            onClick={() => {
              setIsSearchFocused(false);
              setSearchKeyword("");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
                />
            </svg>
          </button>

          {isSearchFocused && searchList && (
            <div className="absolute top-[105%] left-0 bg-[#393C43] rounded-b-xl w-full">
              {searchList.map((data, index) => (
                <div
                key={index}
                className="flex justify-between border-b border-gray-400 text-black p-1.5 last:border-b-0 last:rounded-b-lg hover:bg-[#94b7f5]"
                >
                  <div>{data}</div>
                  <button
                    className="text-[0.7rem] px-1.5 py-0.5 border border-transparent cursor-pointer rounded-lg font-bold bg-[#A3E635] hover:border-blue-700"
                    onClick={() => handleSendRequest(data)}
                    >
                    Send Request
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
          </div>

        {/* Friends */}
        <div className="px-3  border-[#42464D]  flex flex-col gap-2 w-full  ">
          <h1 className="h-10    text-lg flex justify-between items-center  hover:text-white text-[#DCDDDE]">
            Recent <span className="cursor-pointer">+</span>
          </h1>

          {/* Chat option */}
          <div className=" flex flex-col gap-2 hover:cursor-pointer">
            {friendsList.map((data, index) => (
              <div
                onClick={() => handleChat(data)}
                key={index}
                className={`flex h-10 gap-2 items-center  rounded-lg px-2 ${activeChat?.username === data.username ? "bg-[#00A3C4]" : "hover:bg-[#FFFFFF1A]"} `}
              >
                <img
                  src={
                    data.avtar
                      ? data.avtar
                      : `https://ui-avatars.com/api/?name=${data.username}&background=random&color=fff&rounded=true`
                  }
                  alt=""
                  className="h-8 "
                />
                <h1
                  className={` col-span-2   text-xl text-[#DCDDDE] hover:text-[#8E9297]   cursor-pointer  rounded-xl  max-md:text-lg `}
                >
                  {data.username}
                </h1>
              </div>
            ))}
          </div>

          {/* Friend Request */}
          <div>
            <h1 className="h-10 text-lg flex justify-between items-center  hover:text-white text-[#DCDDDE]">
              Pending Requests
            </h1>

            <div className=" flex flex-col gap-2">
              {friendRequestList.map((data, index) => (
                <div
                  key={index}
                  className={`flex justify-between  h-10 gap-2 items-center rounded-lg px-2 ${activeChat?.username === data.username ? "bg-[#A3E635]" : ""} `}
                >
                  <div className="flex gap-2">
                    <img
                      src={data.avtar}
                      alt="t"
                      className="h-8 rounded-full "
                    />
                    <h1
                      className={` col-span-2   text-xl text-[#DCDDDE] hover:text-[#8E9297]   cursor-pointer  rounded-xl  max-md:text-lg `}
                    >
                      {data.username}
                    </h1>
                  </div>
                  <button
                    className="text-white border bg-[#84CC16]  rounded-lg px-2 hover:cursor-pointer hover:bg-[#52810c]"
                    onClick={() => handleAcceptRequest(data.username)}
                  >
                    Accept
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
