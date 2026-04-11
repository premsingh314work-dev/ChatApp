import React from "react";
import { useChatStore } from "../store/useChatStore";
import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {
  const { selectedUser, setSelectecUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);
  return (
    <div className="flex items-center justify-between p-2 bg-slate-400/30 border-b-2 border-white/20">
      <div className="flex gap-2">
        {/* image div */}
        <div
          className={`avatar ${isOnline ? "avatar-online" : "avatar-offline"}`}
        >
          <div className="w-13 rounded-full">
            <img src={selectedUser.avatar || "avatar.png"} />
          </div>
        </div>
        <div className="">
          <h2 className="">{selectedUser.fullName}</h2>
          <h4 className="text-slate-200/50">
            {isOnline ? "Online" : "offline"}
          </h4>
        </div>
      </div>
      <div className="flex items-center p-2">
        <button
          className="hover:scale-120"
          onClick={() => {
            setSelectecUser(null);
          }}
        >
          <X className="text-white/60" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
