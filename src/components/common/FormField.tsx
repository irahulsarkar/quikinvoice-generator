import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export const FormField = ({ label, required, error, hint, children }: FormFieldProps) => {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-[#6e6e73]">
        {label}
        {required ? <span className="ml-1 text-rose-500">*</span> : null}
      </span>
      {children}
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-[#8e8e93]">{hint}</span> : null}
    </label>
  );
};
