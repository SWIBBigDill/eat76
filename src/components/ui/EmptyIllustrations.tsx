export function EmptyRestaurantsIllustration() {
  return (
    <svg
      viewBox="0 0 200 160"
      className="mx-auto h-32 w-40 text-eat-muted/40"
      aria-hidden
    >
      <rect x="30" y="60" width="140" height="80" rx="8" fill="currentColor" opacity="0.15" />
      <rect x="50" y="40" width="100" height="30" rx="6" fill="currentColor" opacity="0.25" />
      <circle cx="70" cy="100" r="12" fill="currentColor" opacity="0.3" />
      <circle cx="100" cy="100" r="12" fill="currentColor" opacity="0.3" />
      <circle cx="130" cy="100" r="12" fill="currentColor" opacity="0.3" />
      <path
        d="M85 130 L100 115 L115 130"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}

export function EmptyFavoritesIllustration() {
  return (
    <svg
      viewBox="0 0 200 160"
      className="mx-auto h-32 w-40 text-eat-muted/40"
      aria-hidden
    >
      <path
        d="M100 130 L55 85 C40 70 40 50 55 40 C70 30 85 40 100 55 C115 40 130 30 145 40 C160 50 160 70 145 85 Z"
        fill="currentColor"
        opacity="0.2"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
