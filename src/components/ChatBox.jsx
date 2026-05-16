import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { chatAPI } from "../api/service";
import Loading from "./Loading";

const ChatBox = ({ currentUser, activeChat }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const stompClientRef = useRef(null);
  const [chatLoading, setChatLoading] = useState(false)

  const apiURL = import.meta.env.VITE_API_URL

  useEffect(()=>{

    handleActiveChat()

  },[activeChat])

  const handleActiveChat = async ()=>{

    try{

      setChatLoading(true)
      const res =await chatAPI.getChat(currentUser.id,activeChat.id)
      // console.log(res.data)
      
      setMessages(()=>res.data)
      setChatLoading(false)

    }catch(error){
      setChatLoading(false)
      console.log(error)
    }

  }

  useEffect(() => {
    if (!currentUser?.id || !activeChat?.id) return;

    if (stompClientRef.current?.active) {
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(`${apiURL}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('jwttoken')}`
      },
      // debug: (str) => console.log("STOMP DEBUG:", str),
      
      onConnect: () => {
        console.log('Connected to WebSocket Successfully!');
        
        const mailbox = `/queue/chat/${currentUser.id}`;
        console.log("Subscribing directly to:", mailbox);
        
        client.subscribe(mailbox, (message) => {
          const incomingMessage = JSON.parse(message.body);
          
          if (incomingMessage.senderId === activeChat.id) {
             setMessages((prev) => [...prev, incomingMessage]);
          } else {
             console.log("New background message from:", incomingMessage.senderId);
             
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker error:', frame.headers['message']);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [currentUser?.id, activeChat?.id]);

  // useEffect(()=>{

  //   // console.log("Messages=",messages)

  // },[messages])



  
  const sendMessage = () => {
    if (messageInput.trim() !== '' && stompClientRef.current?.connected) {
      const chatMessage = {
        senderId: currentUser.id,
        receiverId: activeChat.id,
        content: messageInput,
        timeStamp: new Date()
      };

      stompClientRef.current.publish({
        destination: '/app/chat',
        body: JSON.stringify(chatMessage)
      });

      // Add our own message to the screen immediately
      setMessages((prev) => [...prev, chatMessage]);
      setMessageInput('');
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={` flex flex-col h-full p-2 gap-2 ${activeChat?.id ? "" : "hidden"}`}>
      {
        chatLoading && <Loading/>
      }
      
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === currentUser.id;
          const displayName = isMe ? currentUser.username : activeChat.username;
          const displayIcon = isMe 
            ? currentUser.icon || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}` 
            : activeChat.icon || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeChat.username}`;

          return (
            <div key={index} className={`flex h-auto items-start gap-3 mt-4 px-2 ${msg.senderId === currentUser.id ? "justify-end":""}`}>
              <img src={displayIcon} alt="avatar" className="h-10 rounded-full" />
              <div className="flex flex-col">
                <div className="text-[#DCDDDE] font-bold text-md">
                  {displayName}{" "}
                  <span className="text-[#8E9297] text-sm ml-1">{formatTime(msg.timeStamp)}</span>
                </div>
                <div className=" text-[#DCDDDE] break-words">{msg.content}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center bg-[#383A40] rounded-xl px-2 py-1 mx-4 mb-4 mt-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={`Message @${activeChat?.username || "User"}`}
          className="bg-transparent flex-1 focus:outline-none text-[#DBDEE1] p-3 placeholder:text-[#949BA4]"
        />

        <button 
          onClick={sendMessage}
          className="px-3 text-[#B5BAC1] hover:text-[#FFFFFF] transition-colors cursor-pointer"
        >
          <FontAwesomeIcon icon={faPaperPlane} className="text-lg" />
        </button>
      </div>



    </div>
  );
};

export default ChatBox;


