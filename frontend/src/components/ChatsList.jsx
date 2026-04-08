import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import NoChatsFound from "./NoChatsFound";
import UsersLoadingSkeleton from "./UserLoadingSkeleton";

const ChatsList = () => {
  const { getMyChatPartners, chats, isUserLoading, setSelectecUser } =
    useChatStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);
  if (isUserLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;
  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => {
            setSelectecUser(chat);
          }}
        >
          <div className="flex items-center gap-5">
            {/* Profile Image div */}
            <div className="avatar avatar-online">
              <div className="w-13 rounded-full">
                <img src={chat.avatar || "avatar.png"} />
              </div>
            </div>
            {/* Name etc div */}
            <h4 className="text-slate-200 font-medium truncate">
              {chat.fullName}
            </h4>
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatsList;
