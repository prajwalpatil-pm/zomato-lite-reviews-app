// Plain inline SVG icons — no icon library, no dependency. Each takes a
// className so callers control size and colour (via currentColor).

type IconProps = { className?: string };

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 19l-7-7 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarIcon({
  className,
  filled = true,
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      aria-hidden="true"
    >
      <path
        d="M12 2.5l2.9 6.06 6.6.86-4.87 4.53 1.24 6.55L12 17.9l-5.87 3.06 1.24-6.55L2.5 9.42l6.6-.86L12 2.5z"
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.6}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MapPinIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7.5V12l3 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VerifiedIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.5l2.3 1.7 2.85-.1 1 2.7 2.35 1.6-.9 2.7.9 2.7-2.35 1.6-1 2.7-2.85-.1L12 21.5l-2.3-1.7-2.85.1-1-2.7L3.5 15.6l.9-2.7-.9-2.7 2.35-1.6 1-2.7 2.85.1L12 2.5z"
        fill="currentColor"
      />
      <path
        d="M8.6 12.2l2.2 2.2 4.4-4.4"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PenIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20h4l10.5-10.5a2 2 0 000-2.83l-1.17-1.17a2 2 0 00-2.83 0L4 16v4z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M13.5 6.5l4 4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5.5h16v10H9l-4 3.5v-3.5H4v-10z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
