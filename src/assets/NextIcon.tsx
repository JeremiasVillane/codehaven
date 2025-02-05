import type { SVGProps } from "react";

export function CatppuccinNext(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
      >
        <path d="M12.33 12.85a6.5 6.5 0 1 1 1.55-2.08"></path>
        <path d="M12.33 12.85L5.5 4.5v7m5-7v3"></path>
      </g>
    </svg>
  );
}
