import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "../components/ChatHeader";
import NoChatHistoryPlaceholder from "../components/NoChatHistoryPlaceholder";
import { useAuthStore } from "../store/useAuthStore.js";
import MessagesLoadingSkeleton from "../components/MessagesLoadingSkeleton";
import MessageInput from "../components/MessageInput";

const ChatContainer = () => {
  const {
    getMessagesByUserId,
    selectedUser,
    messages,
    isMessagesLoading,
    subscribeToMessage,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();

  const messageEndRef = useRef<HTMLDivElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedUser?._id) return;

    void getMessagesByUserId(selectedUser._id);
    subscribeToMessage();

    return () => {
      unsubscribeFromMessages();
    };
  }, [
    selectedUser,
    getMessagesByUserId,
    subscribeToMessage,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    const container = chatBodyRef.current;

    if (!container || isMessagesLoading) return;

    container.scrollTop = container.scrollHeight;
  }, [messages, isMessagesLoading]);

  if (!authUser || !selectedUser) {
    return null;
  }

  return (
    <>
      <ChatHeader />

      <div ref={chatBodyRef} className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${
                  msg.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-lg h-48 object-cover"
                    />
                  )}

                  {msg.text && <p className="mt-2">{msg.text}</p>}

                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </>
  );
};

export default ChatContainer;
