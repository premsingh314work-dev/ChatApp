import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "../components/ChatHeader";

const ChatContainer = () => {
  const { getMessagesByUserId, selectedUser, messages } = useChatStore();
  //   console.log(selectedUser._id);
  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
  }, [selectedUser, getMessagesByUserId]);

  return (
    <>
      <ChatHeader />
      {messages.length === 0 ? (
        <div>Please Chat to see messages</div>
      ) : (
        <div>
          {messages.map((message) => {
            return <h4 key={message._id}>{message.text}</h4>;
          })}
        </div>
      )}
    </>
  );
};

export default ChatContainer;
