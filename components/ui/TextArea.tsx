import cn from "clsx";

export default function TextArea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-xs transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 h-full",
        className,
      )}
      {...props}
    />
  );
}
