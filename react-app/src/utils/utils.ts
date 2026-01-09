import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseValue = (
  value: any,
  _type: "number" | "string" | "boolean"
) => {
  if (value == null) return null;

  if (typeof value === "string" && value.trim() === "") return null;

  if (value === "yes" || value === "Yes" || value === "YES" || value === true)
    return 1;
  if (value === "no" || value === "No" || value === "NO" || value === false)
    return 0;

  return value;

  // switch (type) {
  //   case "number": {
  //     const num = Number(value);
  //     return isNaN(num) ? null : num;
  //   }

  //   case "boolean":
  //     return String(value).toLowerCase().startsWith("yes");

  //   case "string":
  //     return String(value);

  //   default:
  //     return null;
  // }
};

export const normalizeValue = (value: unknown) => {
  if (value == null) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  return value;
};
