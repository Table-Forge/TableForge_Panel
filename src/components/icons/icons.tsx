import type { SVGProps } from "react";

export function KeystoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
      <path d="M12 2l7 10-7 10-7-10z" />
      <path d="M12 7.5L15.2 12 12 16.5 8.8 12z" fill="#000000" fillOpacity="0.35" />
    </svg>
  );
}

export function D20Icon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2l8.66 5v10L12 22l-8.66-5V7z" />
      <path d="M12 7.2l5.2 8.6H6.8z" />
      <path d="M12 2v5.2M3.34 7l3.46 8.8M20.66 7l-3.46 8.8M3.34 17l3.46-1.2M20.66 17l-3.46-1.2M12 22l-5.2-6.2M12 22l5.2-6.2" />
    </svg>
  );
}
