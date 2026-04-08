import React, { useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore";
import { LogOutIcon, Volume2Icon, VolumeOffIcon } from "lucide-react";
const ProfileHeader = () => {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const fileInputRef = useRef(null);
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = (e) => {
    console.log("fnx run");
    
    const file = e.target.files[0];
    
    if(!file) return;
    const reader = new FileReader();    
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result;      
      setSelectedImg(base64Image);
      await updateProfile({profilePic:base64Image});
      console.log("fnx end");
    }; 
  };

  return (
    <div className="p-6 border-b border-slate-700/50 flex">
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-15">
        <div className="flex items-center gap-3">  
          <div className="avatar avatar-online">
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={() => {
                fileInputRef.current.click();
              }}
            >
              <img
                src={selectedImg || authUser.avatar || "avatar.png"}
                alt="User Image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-sm">change</span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-45 truncate">
              {authUser.fullName}
            </h3>
            <p className="text-slate-400  text-sm">Online</p>
          </div>
        </div>
          <div className="flex gap-4 item-center">
            <button className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logout}>
              <LogOutIcon className="size-5" />
            </button>

            <button className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={toggleSound}
            >
              {isSoundEnabled ? (
                <Volume2Icon className="size-5" />
              ) : (
                <VolumeOffIcon className="size-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
