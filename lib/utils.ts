import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// utils/stringConversion.ts

export const hexToAscii = (hex: string) => {
  let ascii = '';
  for (let i = 0; i < hex.length; i += 2) {
    const part = hex.substr(i, 2);
    ascii += String.fromCharCode(parseInt(part, 16));
  }
  return ascii.replace(/[^\x20-\x7E]/g, ''); // Replace non-printable characters with empty string
};

export const isHex = (str: string) => /^[0-9A-Fa-f]+$/.test(str);

export const convertAssetName = (assetName: string) => {
  return isHex(assetName) ? hexToAscii(assetName) : assetName;
};