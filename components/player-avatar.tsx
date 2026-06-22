import clsx from "clsx";

type PlayerAvatarProps = {
  name: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function PlayerAvatar({
  name,
  imageUrl,
  size = "md",
}: PlayerAvatarProps) {
  const initials = getInitials(name);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={clsx(
          "shrink-0 rounded-full border border-white/10 object-cover",
          sizeClasses[size],
        )}
      />
    );
  }

  return (
    <span
      className={clsx(
        "flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-emerald-400/20 font-bold text-emerald-200",
        sizeClasses[size],
      )}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}
