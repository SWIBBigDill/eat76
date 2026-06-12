import { type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label htmlFor={inputId} className="block space-y-1.5">
      <span className="text-sm font-medium text-eat-ink">{label}</span>
      <input
        id={inputId}
        className={`w-full rounded-xl border border-eat-border bg-white px-4 py-3 text-sm text-eat-ink outline-none transition focus:border-eat-blue focus:ring-2 focus:ring-eat-blue/20 ${className}`}
        {...props}
      />
    </label>
  );
}

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export function TextArea({ label, id, className = "", ...props }: TextAreaProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label htmlFor={inputId} className="block space-y-1.5">
      <span className="text-sm font-medium text-eat-ink">{label}</span>
      <textarea
        id={inputId}
        rows={3}
        className={`w-full rounded-xl border border-eat-border bg-white px-4 py-3 text-sm text-eat-ink outline-none transition focus:border-eat-blue focus:ring-2 focus:ring-eat-blue/20 ${className}`}
        {...props}
      />
    </label>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { value: string; label: string }[];
};

export function Select({ label, id, options, className = "", ...props }: SelectProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label htmlFor={inputId} className="block space-y-1.5">
      <span className="text-sm font-medium text-eat-ink">{label}</span>
      <select
        id={inputId}
        className={`w-full rounded-xl border border-eat-border bg-white px-4 py-3 text-sm text-eat-ink outline-none transition focus:border-eat-blue focus:ring-2 focus:ring-eat-blue/20 ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
