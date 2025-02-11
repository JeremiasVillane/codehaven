import { useClickOutsideList } from "@/hooks";
import type { Member } from "@/types";
import { useState } from "react";
import {
  AVATAR_SIZE,
  FONT_SIZE,
  MAX_USERS_BEFORE_LIST,
} from "./avatars-constants";
import UserInfo from "./user-info";

interface SurplusProps {
  otherUsers: Member[];
}

export default function Surplus({ otherUsers }: SurplusProps) {
  const [showList, setShowList] = useState(false);
  const { listRef, plusButtonRef } = useClickOutsideList(() =>
    setShowList(false)
  );

  if (otherUsers.length <= MAX_USERS_BEFORE_LIST) {
    return null;
  }

  const extraCount = otherUsers.slice(MAX_USERS_BEFORE_LIST).length;
  const zIndexValue = otherUsers.length + 50;

  return (
    <div className="absolute flex flex-col items-center right-0">
      <div
        ref={plusButtonRef}
        className="absolute flex items-center justify-center text-white bg-gray-600 border-2 border-gray-300 rounded-full mb-2 select-none cursor-pointer right-0"
        style={{
          zIndex: zIndexValue,
          width: `${AVATAR_SIZE}px`,
          height: `${AVATAR_SIZE}px`,
          fontSize: FONT_SIZE,
        }}
        onClick={() => setShowList(!showList)}
      >
        +{extraCount}
      </div>

      {showList && (
        <div
          ref={listRef}
          className="relative p-2 bg-[#39414e] text-white rounded-md min-w-[280px] max-h-[250px] overflow-y-auto z-50"
          style={{
            top: "2.2rem",
            left: "6rem",
          }}
        >
          {otherUsers.slice(MAX_USERS_BEFORE_LIST).map((user) => (
            <div
              key={user.clientId}
              className="p-2 hover:bg-gray-600 rounded-md md:p-3"
            >
              <UserInfo user={user} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
