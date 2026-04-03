export default function Button({
  children,
  onClick,
  type,
  disabled,
  size,
  primary,
  rounded,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  size: "sm" | "lg";
  primary?: boolean;
  rounded?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`w-fit cursor-pointer ${primary ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-gray-500 text-slate-200"} font-bold ${rounded ? "rounded-full" : "rounded-lg"} shadow-lg transition-all duration-300 active:scale-95 ${size === "sm" ? "text-sm px-3 py-1" : size === "lg" ? "text-lg px-6 py-3" : "text-base px-3 py-1"} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}
