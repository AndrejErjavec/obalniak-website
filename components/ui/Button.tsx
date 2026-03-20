import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-blue-500 text-white",
  secondary: "bg-gray-200 text-gray-900",
  danger: "bg-red-600 text-white",
};

export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center rounded-md px-4 py-2 min-w-20 min-h-10 font-medium
        transition-colors cursor-pointer
        disabled:cursor-not-allowed disabled:opacity-50
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </span>
      ) : (
        children
      )}
    </button>
  );
}
