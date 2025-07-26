// export function cn(...classes: (string | false | null | undefined)[]): string {
//   return classes.filter(Boolean).join(' ');
// }


import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
