function Inputs({
  placeholder,
  value,
  onChange,
  type,
  textarea,
  required,
  onFocus,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  type?: string;
  textarea: boolean;
  required?: boolean;
  onFocus?: () => void;
}) {
  const baseClasses =
    "focus:ring-2 focus:ring-indigo-500 focus:outline-none rounded-md border border-gray-300 dark:bg-gray-700 dark:border-gray-600 px-3 py-2 w-full mb-4 dark:text-white transition-all";
  return textarea ? (
    <textarea
      className={baseClasses}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      onFocus={onFocus}
    />
  ) : (
    <input
      className={baseClasses}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      onFocus={onFocus}
    />
  );
}

export default Inputs;
