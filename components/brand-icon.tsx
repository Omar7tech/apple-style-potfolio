import { icons, type IconKey } from "@/lib/icons";

/** A real product logo in its own colour. Next.js is black, so it follows the text colour. */
export function BrandIcon({
  name,
  size = 20,
  className,
  mono = false,
}: {
  name: IconKey;
  size?: number;
  className?: string;
  mono?: boolean;
}) {
  const icon = icons[name];
  const fill = mono || icon.hex === "#000000" ? "currentColor" : icon.hex;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role="img"
      aria-label={icon.name}
      className={className}
    >
      <path d={icon.path} fill={fill} />
    </svg>
  );
}

export function StackRow({ stack, size = 18 }: { stack: IconKey[]; size?: number }) {
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Built with">
      {stack.map((key) => (
        <li
          key={key}
          className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-[13px] text-ink-2 shadow-[0_0_0_0.5px_var(--line-strong)]"
        >
          <BrandIcon name={key} size={size - 4} />
          {icons[key].name}
        </li>
      ))}
    </ul>
  );
}
