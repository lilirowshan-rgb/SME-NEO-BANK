export interface ChipOption<T extends string> {
  value: T;
  label: string;
}

interface ChipsProps<T extends string> {
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  size?: 'md' | 'sm';
}

/** A single-select row of pill buttons (filters, periods, tabs). */
export default function Chips<T extends string>({ options, value, onChange, label, size = 'md' }: ChipsProps<T>) {
  return (
    <div role="group" aria-label={label} className={`chips${size === 'sm' ? ' chips-sm' : ''}`}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className="chip"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
