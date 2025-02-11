import { Member } from "@/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getUserInitials } from "./avatars-helpers";

dayjs.extend(relativeTime);

interface UserInfoProps {
  user: Member;
  isSelf?: boolean;
}

export default function UserInfo({ user, isSelf }: UserInfoProps) {
  const statusIndicatorText = dayjs().to(user.lastEvent.timestamp);

  const displayName = isSelf
    ? `${user.profileData.name} (You)`
    : user.profileData.name;

  const bgColor = user.isConnected
    ? user.profileData.memberColor
    : "rgb(229 231 235)";

  const textColorClass = user.isConnected ? "text-white" : "text-gray-400";

  const statusBg = user.isConnected ? "bg-green-500" : "bg-gray-400";

  return (
    <div className="flex items-center justify-start">
      <div
        id="avatar"
        className="relative flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full border-2 border-gray-300"
        style={{ backgroundColor: bgColor }}
      >
        <p className={`text-xs ${textColorClass}`}>
          {getUserInitials(user?.profileData.name)}
        </p>
      </div>

      <div id="user-list" className="pl-3 w-full">
        <p className="block font-semibold text-sm mb-[2px]">{displayName}</p>
        <div className="flex items-center">
          <div className={`rounded-full w-[5px] h-[5px] ${statusBg}`} />
          <p className="font-medium text-xs ml-[0.3rem] text-[#89929f]">
            {statusIndicatorText}
          </p>
        </div>
      </div>
    </div>
  );
}
