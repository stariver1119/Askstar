import type { SVGProps } from 'react';

export const AquariusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"  // width, height 제거하고 viewBox만 사용
    {...props}  // props를 svg에 전달
  >
    <g className="nc-icon-wrapper">
      <path
        d="M26.423 22.839c2.489 6.038-1.309 9.469-5.532 12C16.237 37.635 9.515 41 9.515 41l-3.758-3.757L2 33.485s3.365-6.722 6.158-11.376c2.534-4.223 5.965-8.021 12-5.532l1.878-5.636 10.02 10.02z"
        opacity="0.3"
      />
      <path
        fill="none"
        stroke="currentColor"  // #000 → currentColor로 변경
        strokeMiterlimit="10"
        strokeWidth="2"
        d="m26.423 22.839-2.505-2.504M26.423 22.839c2.489 6.038-1.309 9.469-5.532 12C16.237 37.635 9.515 41 9.515 41l-3.758-3.757L2 33.485s3.365-6.722 6.158-11.376c2.534-4.223 5.965-8.021 12-5.532l1.878-5.636 10.02 10.02z"
      />
      <path
        fill="none"
        stroke="currentColor"  // #000 → currentColor로 변경
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M27 12a5 5 0 0 1 10 0v25a5 5 0 1 0 5-5"
      />
      <path
        fill="none"
        stroke="currentColor"  // #000 → currentColor로 변경
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M36 5a5 5 0 0 1 5 5v18M30 36a3 3 0 1 0 3 3V27"
      />
      <circle cx="7" cy="12" r="1" fill="currentColor" />
      <path 
        d="M13.719 5.328A9.5 9.5 0 0 1 12 3a9.5 9.5 0 0 1-1.719 2.328A9.5 9.5 0 0 1 8 7a9.5 9.5 0 0 1 4 4 9.5 9.5 0 0 1 4-4 9.5 9.5 0 0 1-2.281-1.672"
        fill="currentColor"
      />
    </g>
  </svg>
);