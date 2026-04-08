import React from "react";
import { useChatStore } from "../store/useChatStore";

const ActiveTabSwitch = () => {
  const { activeTab, setActveTab } = useChatStore();
  return (
    <>
      <div className="tabs tabs-boxed bg-transparent p-2 m-2 gap-10">
        <button
          onClick={() => setActveTab("chats")}
          className={`rounded-4xl tab ${activeTab === "chats" ? "bg-cyan-500/20" : "text-slate-400"}`}
        >
          Chats
        </button>
        <button
          onClick={() => setActveTab("contacts")}
          className={`rounded-4xl tab ${activeTab === "contacts" ? "bg-cyan-500/20" : "text-slate-400 "}`}
        >Contacts</button>
      </div>
    </>
  );
};

export default ActiveTabSwitch;
