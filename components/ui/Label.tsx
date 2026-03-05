import cn from "clsx";

export default function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label className={cn("mb-1 block text-sm font-medium text-gray-700", className)} {...props} />;
}
