import { useBoundStore } from "@/src/store";

export const BRAND_LOGOS = {
  dark: {
    vertical: "https://tableforge-bucket.s3.amazonaws.com/development/public/images/394a0616-6467-4be9-b6ad-6df1a5a57cc9.webp?v=1",
    minimal: "https://tableforge-bucket.s3.amazonaws.com/development/public/images/d4037d09-0893-4098-bc52-f94291c91c00.png",
    horizontal: "https://tableforge-bucket.s3.amazonaws.com/development/public/images/0b85dfdf-3c07-4aad-b8fe-0c88e2bbfa3f.webp?v=1",
  },
  light: {
    vertical: "https://tableforge-bucket.s3.amazonaws.com/development/public/images/6146fade-9fde-4082-b17c-2643d7ddedaf.png",
    minimal: "https://tableforge-bucket.s3.amazonaws.com/development/public/images/0a9406bb-e930-4238-9a21-59b5bb0eb80b.png",
    horizontal: "https://tableforge-bucket.s3.amazonaws.com/development/public/images/221ee0bd-1c93-4b77-a0a5-aef9d911c02c.png",
  },
} as const;

export function useLogo() {
  const theme = useBoundStore((state) => state.theme);
  return theme === "light" ? BRAND_LOGOS.light : BRAND_LOGOS.dark;
}
