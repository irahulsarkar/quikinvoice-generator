import { INDIAN_STATES_AND_UTS } from '../../constants/indianStates';

interface StateSelectProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

export const StateSelect = ({ value, onChange, id }: StateSelectProps) => {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full min-h-[44px] rounded-xl border border-[#d2d2d7] bg-white px-3 py-2 text-sm text-[#1d1d1f] outline-none transition focus:border-[#0071e3] focus:ring-2 focus:ring-[#d9ecff]"
    >
      {INDIAN_STATES_AND_UTS.map((state) => (
        <option key={state.gstCode} value={state.gstCode}>
          {state.gstCode} - {state.name}
        </option>
      ))}
    </select>
  );
};
