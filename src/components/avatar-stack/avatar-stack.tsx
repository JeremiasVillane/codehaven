import { Member } from "@/types";
import { useMembers, useSpace } from "@ably/spaces/react";
import { useEffect, useMemo } from "react";
import Avatars from "./avatars";
import { colorFromName, getRandomName } from "./avatars-helpers";

export function AvatarStack() {
  const { space } = useSpace();
  const { self, others } = useMembers();

  const name = useMemo(() => getRandomName(), []);
  const memberColor = useMemo(() => colorFromName(name), []);

  useEffect(() => {
    if (space) {
      space.enter({ name, memberColor });
    }
  }, [space]);

  return (
    <Avatars
      self={self as Member | null}
      otherUsers={others.filter((m) => m.isConnected) as Member[]}
    />
  );
}
