import { Member } from "@/types";
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from "unique-names-generator";
import {
  AVATAR_SIZE,
  MAX_USERS_BEFORE_LIST,
  OVERLAP_AMOUNT,
} from "./avatars-constants";

export function colorFromName(name: string): string {
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum = name.charCodeAt(i) + ((sum << 5) - sum);
  }

  const hue = Math.abs(sum) % 360;

  const saturation = 60;
  const lightness = 55;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function getRandomName() {
  const storedUserName = localStorage.getItem("codehaven:presence-userName");

  if (storedUserName) return storedUserName;

  const randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    length: 2,
    separator: "_",
    style: "lowerCase",
  });

  const randomNameWithNumber = `${randomName}_${Math.floor(
    Math.random() * 10000
  )}`;

  localStorage.setItem("codehaven:presence-userName", randomNameWithNumber);
  return randomNameWithNumber;
}

export function getUserInitials(name: string | undefined) {
  if (!name) return "";

  const userInitials = name
    .split("_")
    .map((word: string) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

  return userInitials;
}

export function calculateRightOffset({
  usersCount,
  index = 0,
}: {
  usersCount: number;
  index: number;
}): number {
  return usersCount > MAX_USERS_BEFORE_LIST
    ? (index + 1) * OVERLAP_AMOUNT
    : index * OVERLAP_AMOUNT;
}

export function calculateTotalWidth({ users }: { users: Member[] }): number {
  return (
    AVATAR_SIZE +
    OVERLAP_AMOUNT * Math.min(users.length, MAX_USERS_BEFORE_LIST + 1)
  );
}
