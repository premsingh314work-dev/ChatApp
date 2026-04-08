import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimateContainer";
import ProfileHeader from "../components/ProfleHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import ContactsList from "../components/ContactsList";
import ChatContainer from "./ChatContainer";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative w-full max-w-6xl h-200 p-20">
      <BorderAnimatedContainer>
        {/* LEFT SIDE */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">

          <ProfileHeader />

          <div className="flex items-center justify-center">
            <ActiveTabSwitch />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactsList/>}
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;
