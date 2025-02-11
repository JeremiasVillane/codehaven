import { Member } from "@/types";
import { useState } from "react";
import { AVATAR_SIZE, FONT_SIZE } from "./avatars-constants";
import {
  calculateRightOffset,
  calculateTotalWidth,
  getUserInitials,
} from "./avatars-helpers";
import ChangeNameModal from "./change-name-modal";
import Surplus from "./surplus";
import UserInfo from "./user-info";

const SelfAvatar: React.FC<{ self: Member | null }> = ({ self }) => {
  const [hover, setHover] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");

  const handleClick = () => {
    if (!self) return;
    setNewName(self.profileData.name);
    setShowModal(true);
  };

  if (!self) {
    return <i className="pi pi-spin pi-spinner" />;
  }

  return (
    <div
      title="Click to change your name"
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleClick}
      className="relative rounded-full flex items-center justify-center border-2 border-border cursor-pointer"
      style={{
        width: `${AVATAR_SIZE}px`,
        height: `${AVATAR_SIZE}px`,
        backgroundColor: self?.profileData.memberColor,
      }}
    >
      <p className="leading-4 text-white" style={{ fontSize: FONT_SIZE }}>
        You
      </p>

      {hover && self && (
        <div
          className="absolute top-[2.2rem] p-4 bg-white dark:bg-black text-slate-600 dark:text-white rounded-md min-w-[240px] z-50"
          style={{ left: "50%", transform: "translateX(-50%)" }}
        >
          <UserInfo user={self} isSelf />
        </div>
      )}

      {showModal && (
        <ChangeNameModal
          {...{ showModal, setShowModal, newName, setNewName }}
        />
      )}
    </div>
  );
};

const OtherAvatars: React.FC<{ users: Member[]; usersCount: number }> = ({
  users,
  usersCount,
}) => {
  const [hoveredClientId, setHoveredClientId] = useState<string | null>(null);

  return (
    <>
      {users.map((user, index) => {
        const rightOffset = calculateRightOffset({ usersCount, index });
        const isOnline = user.isConnected;
        const textColor = isOnline ? "text-white" : "text-gray-400";
        const bgColor = isOnline ? user?.profileData.memberColor : "#C6CED9";

        return (
          <div
            className="absolute flex flex-col items-center"
            key={user.clientId}
            style={{
              right: rightOffset,
              zIndex: users.length - index,
            }}
          >
            <div
              className="relative rounded-full flex items-center justify-center border-2 border-border"
              style={{
                backgroundColor: bgColor,
                width: `${AVATAR_SIZE}px`,
                height: `${AVATAR_SIZE}px`,
              }}
              onMouseOver={() => setHoveredClientId(user.clientId)}
              onMouseLeave={() => setHoveredClientId(null)}
              id="avatar"
            >
              <p
                className={`text-sm leading-4 ${textColor}`}
                style={{ fontSize: FONT_SIZE }}
              >
                {getUserInitials(user?.profileData.name)}
              </p>
            </div>

            {hoveredClientId === user.clientId ? (
              <div
                className="absolute top-[2.2rem] p-4 bg-white dark:bg-black text-slate-600 dark:text-white rounded-md min-w-[240px] shadow-lg"
                style={{ left: "50%", transform: "translateX(-50%)" }}
              >
                <UserInfo user={user} />
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
};

export default function Avatars({
  otherUsers,
  self,
}: {
  otherUsers: Member[];
  self: Member | null;
}) {
  const totalWidth = calculateTotalWidth({ users: otherUsers });

  return (
    <div className="relative flex" style={{ width: `${totalWidth}px` }}>
      <SelfAvatar self={self} />
      <OtherAvatars usersCount={otherUsers.length} users={otherUsers} />
      <Surplus otherUsers={otherUsers} />
    </div>
  );
}
