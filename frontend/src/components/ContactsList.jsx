import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import NoChatsFound from "./NoChatsFound";
import UsersLoadingSkeleton from "./UserLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";
const ContactsList = () => {
  const { getAllContacts, allContacts, isUserLoading, setSelectecUser } =
    useChatStore();
    const {onlineUsers}=useAuthStore()

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);
  if (isUserLoading) return <UsersLoadingSkeleton />;
  if (allContacts.length === 0) return <NoChatsFound />;
  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => {
            setSelectecUser(contact);
          }}
        >
          <div className="flex items-center gap-5">
            {/* Profile Image div */}
            <div className={`avatar ${onlineUsers.includes(contact._id)?"avatar-online":"avatar-offline"}`}>
              <div className="w-13 rounded-full">
                <img src={contact.avatar || "avatar.png"} />
              </div>
            </div>
            {/* Name etc div */}
            <h4 className="text-slate-200 font-medium truncate">
              {contact.fullName}
            </h4>
          </div>
        </div>
      ))}
    </>
  );
};

export default ContactsList;
