import { CursorSvg } from "@/assets";
import { useIsMobile } from "@/hooks";
import useTrackCursor from "@/hooks/use-track-cursor";
import { Member } from "@/types";
import type { CursorUpdate as _CursorUpdate } from "@ably/spaces";
import { useCursors } from "@ably/spaces/react";
import React, { useState } from "react";

interface YourCursorProps {
  self: Member | null;
  parentRef: React.RefObject<HTMLDivElement>;
  showOwn?: boolean;
}

const YourCursor = ({ self, parentRef, showOwn = false }: YourCursorProps) => {
  const [cursorPosition, setCursorPosition] = useState<{
    left: number;
    top: number;
    state: string;
  } | null>(null);
  const handleSelfCursorMove = useTrackCursor(setCursorPosition, parentRef);
  if (!self || !cursorPosition || cursorPosition.state === "leave" || !showOwn)
    return null;

  const { memberColor } = self.profileData;

  return (
    <div
      className="absolute"
      onMouseMove={(e) => handleSelfCursorMove(e)}
      style={{
        top: `${cursorPosition?.top || 0}px`,
        left: `${cursorPosition?.left || 0}px`,
      }}
    >
      <CursorSvg cursorColor={memberColor} />
      <div
        style={{ backgroundColor: memberColor }}
        className="text-sm leading-5 text-white whitespace-nowrap ml-2 px-4 py-2 rounded-full"
      >
        You
      </div>
    </div>
  );
};

type CursorUpdate = Omit<_CursorUpdate, "data"> & {
  data: { state: "move" | "leave" };
};

const MemberCursors = () => {
  const isMobile = useIsMobile();
  const { cursors } = useCursors({ returnCursors: true });
  
  if (isMobile) return null;
  
  return (
    <>
      {Object.values(cursors).map((data) => {
        const cursorUpdate = data.cursorUpdate as CursorUpdate;
        const member = data.member as Member;
        if (cursorUpdate.data.state === "leave") return;

        const { memberColor } = member.profileData;

        return (
          <div
            key={member.connectionId}
            id={`member-cursor-${member.connectionId}`}
            className="absolute"
            style={{
              left: `${cursorUpdate.position.x}px`,
              top: `${cursorUpdate.position.y}px`,
            }}
          >
            <CursorSvg cursorColor={memberColor} />
            <div
              style={{ backgroundColor: memberColor }}
              className="text-sm leading-5 text-white whitespace-nowrap ml-2 px-4 py-2 rounded-full"
            >
              {member.profileData.name}
            </div>
          </div>
        );
      })}
    </>
  );
};

export { MemberCursors, YourCursor };
