interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export const Toggle = ({ label, checked, onChange, description }: ToggleProps) => {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={`flex min-h-[44px] w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition ${checked
        ? 'border-[#a7d4ff] bg-[#eaf4ff] text-[#004b8d]'
        : 'border-[#d2d2d7] bg-white text-[#3a3a3c] hover:border-[#a1a1a6]'
      }`}
    >
      <span>
        <span className="text-sm font-medium">{label}</span>
        {description ? <span className="mt-0.5 block text-xs opacity-80">{description}</span> : null}
      </span>
      <span
        className={`h-5 w-10 rounded-full p-0.5 transition ${checked ? 'bg-[#0071e3]' : 'bg-[#c7c7cc]'}`}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </span>
    </button>
  );
};
