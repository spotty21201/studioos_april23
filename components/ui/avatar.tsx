type AvatarProps = {
  name: string;
  size?: "sm" | "md" | "lg";
};

const sizeClassMap = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-xs",
  lg: "h-12 w-12 text-sm",
};

export function Avatar({ name, size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full border border-white/50 bg-accent-soft font-mono font-medium text-accent ${sizeClassMap[size]}`}
    >
      {initials}
    </div>
  );
}
