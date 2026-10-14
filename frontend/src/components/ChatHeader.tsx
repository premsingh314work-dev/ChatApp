import { useChatStore } from "../store/useChatStore";
import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {
  const { selectedUser, setSelectecUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  // Handle the case where no user is selected
  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex items-center justify-between p-2 bg-slate-400/30 border-b-2 border-white/20">
      <div className="flex gap-2">
        {/* User avatar */}
        <div
          className={`avatar ${isOnline ? "avatar-online" : "avatar-offline"}`}
        >
          <div className="w-13 rounded-full">
            <img
              src={selectedUser.avatar || "/avatar.png"}
              alt={`${selectedUser.fullName}'s avatar`}
            />
          </div>
        </div>

        {/* User details */}
        <div>
          <h2>{selectedUser.fullName}</h2>
          <h4 className="text-slate-200/50">
            {isOnline ? "Online" : "Offline"}
          </h4>
        </div>
      </div>

      <div className="flex items-center p-2">
        <button
          type="button"
          className="hover:scale-120"
          onClick={() => setSelectecUser(null)}
          aria-label="Close chat"
        >
          <X className="text-white/60" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
