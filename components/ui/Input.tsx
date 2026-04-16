import cn from "clsx";

export default function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-xs transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
        className,
      )}
      {...props}
    />
  );
}
