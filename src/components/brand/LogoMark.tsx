type LogoMarkProps = {
  size?: number;
  className?: string;
};

export function LogoMark({ size = 44, className = "" }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-xl shrink-0 ${className}`}
      aria-hidden
    >
      <rect width="200" height="200" rx="40" fill="white" />
      <path
        d="M55 55 L145 55 L155 165 L45 165 Z"
        stroke="#0047BA"
        strokeWidth="10"
        strokeLinejoin="round"
        fill="white"
      />
      <rect
        x="80"
        y="38"
        width="40"
        height="22"
        rx="4"
        stroke="#0047BA"
        strokeWidth="8"
        fill="white"
      />
      <text
        x="100"
        y="105"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="28"
        fontStyle="italic"
        fontWeight="600"
        fill="#0047BA"
      >
        eat
      </text>
      <text
        x="100"
        y="145"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="42"
        fontStyle="italic"
        fontWeight="700"
        fill="#ED174C"
      >
        76
      </text>
    </svg>
  );
}
