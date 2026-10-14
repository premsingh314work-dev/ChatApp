import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore";
import { LogOutIcon, Volume2Icon, VolumeOffIcon } from "lucide-react";
import toast from "react-hot-toast";

const ProfileHeader = () => {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      if (typeof reader.result !== "string") {
        toast.error("Failed to read image");
        return;
      }

      const base64Image = reader.result;

      try {
        await updateProfile({ avatar: base64Image });
        setSelectedImg(base64Image);
      } catch {
        toast.error("Failed to update profile picture");
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read image");
    };

    reader.readAsDataURL(file);
  };

  // The user may not be authenticated yet.
  if (!authUser) return null;

  return (
    <div className="p-6 border-b border-slate-700/50 flex">
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-15">
          <div className="flex items-center gap-3">
            <div className="avatar avatar-online">
              <button
                type="button"
                aria-label="Change profile picture"
                className="size-14 rounded-full overflow-hidden relative group"
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={selectedImg ?? authUser.avatar ?? "/avatar.png"}
                  alt="User avatar"
                  className="size-full object-cover"
                />

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-sm">Change</span>
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
              <p className="text-slate-400 text-sm">Online</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <button
              type="button"
              aria-label="Log out"
              className="text-slate-400 hover:text-slate-200 transition-colors"
              onClick={logout}
            >
              <LogOutIcon className="size-5" />
            </button>

            <button
              type="button"
              aria-label={isSoundEnabled ? "Mute sounds" : "Enable sounds"}
              className="text-slate-400 hover:text-slate-200 transition-colors"
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
