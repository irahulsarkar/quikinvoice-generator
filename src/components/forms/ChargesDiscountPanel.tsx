import { invoiceSelectors, useInvoiceStore } from '../../store/useInvoiceStore';
import type { ChargeRule } from '../../types/invoice';
import { SectionCard } from '../common/SectionCard';
import { Toggle } from '../common/Toggle';

const numberFromInput = (value: string) => {
  const next = Number(value);
  return Number.isFinite(next) ? next : 0;
};

const chargeLabels: Array<{ key: 'shipping' | 'packing' | 'additional'; label: string }> = [
  { key: 'shipping', label: 'Shipping charges' },
  { key: 'packing', label: 'Packing charges' },
  { key: 'additional', label: 'Additional charges' },
];

interface ChargeRowProps {
  label: string;
  charge: ChargeRule;
  onChange: (patch: Partial<ChargeRule>) => void;
}

const ChargeRow = ({ label, charge, onChange }: ChargeRowProps) => {
  return (
    <div className="rounded-xl border border-[#e5e5ea] bg-white p-3">
      <Toggle label={label} checked={charge.enabled} onChange={(checked) => onChange({ enabled: checked })} />
      {charge.enabled ? (
        <div className="form-grid-4 mt-3 gap-2">
          <label className="space-y-1 text-xs text-[#6e6e73]">
            Mode
            <select
              value={charge.mode}
              onChange={(event) => onChange({ mode: event.target.value as 'flat' | 'percent' })}
              className="w-full rounded-md border border-[#d2d2d7] bg-white px-2 py-1"
            >
              <option value="flat">Flat</option>
              <option value="percent">%</option>
            </select>
          </label>

          <label className="space-y-1 text-xs text-[#6e6e73]">
            Value
            <input
              type="number"
              min={0}
              value={charge.value}
              onChange={(event) => onChange({ value: numberFromInput(event.target.value) })}
              className="w-full rounded-md border border-[#d2d2d7] bg-white px-2 py-1"
            />
          </label>

          <Toggle
            label="Before tax"
            checked={charge.beforeTax}
            onChange={(checked) => onChange({ beforeTax: checked })}
            description="Include in taxable value"
          />

          <Toggle
            label="Taxable"
            checked={charge.taxable}
            onChange={(checked) => onChange({ taxable: checked })}
            description="Only applied for before-tax charges"
          />
        </div>
      ) : null}
    </div>
  );
};

export const ChargesDiscountPanel = () => {
  const charges = useInvoiceStore(invoiceSelectors.chargesDiscount);
  const { updateChargesDiscount } = useInvoiceStore(invoiceSelectors.actions);

  return (
    <SectionCard title="5) Charges / Discount" subtitle="Taxable and non-taxable adjustments">
      <div className="space-y-3">
        {chargeLabels.map(({ key, label }) => (
          <ChargeRow
            key={key}
            label={label}
            charge={charges[key]}
            onChange={(patch) => {
              if (key === 'shipping') {
                updateChargesDiscount({ shipping: patch });
                return;
              }
              if (key === 'packing') {
                updateChargesDiscount({ packing: patch });
                return;
              }
              updateChargesDiscount({ additional: patch });
            }}
          />
        ))}
      </div>

      <div className="rounded-xl border border-[#e5e5ea] bg-white p-3">
        <Toggle
          label="Overall discount"
          checked={charges.overallDiscount.enabled}
          onChange={(checked) => updateChargesDiscount({ overallDiscount: { enabled: checked } })}
        />
        {charges.overallDiscount.enabled ? (
          <div className="form-grid-3 mt-3 gap-2">
            <label className="space-y-1 text-xs text-[#6e6e73]">
              Mode
              <select
                value={charges.overallDiscount.mode}
                onChange={(event) => updateChargesDiscount({ overallDiscount: { mode: event.target.value as 'flat' | 'percent' } })}
                className="w-full rounded-md border border-[#d2d2d7] bg-white px-2 py-1"
              >
                <option value="flat">Flat</option>
                <option value="percent">%</option>
              </select>
            </label>

            <label className="space-y-1 text-xs text-[#6e6e73]">
              Value
              <input
                type="number"
                min={0}
                value={charges.overallDiscount.value}
                onChange={(event) => updateChargesDiscount({ overallDiscount: { value: numberFromInput(event.target.value) } })}
                className="w-full rounded-md border border-[#d2d2d7] bg-white px-2 py-1"
              />
            </label>

            <Toggle
              label="Before tax"
              checked={charges.overallDiscount.beforeTax}
              onChange={(checked) => updateChargesDiscount({ overallDiscount: { beforeTax: checked } })}
              description="Apply discount before GST"
            />
          </div>
        ) : null}
      </div>

      <label className="block text-xs text-[#6e6e73]">
        Round-off (Rs)
        <input
          type="number"
          step="0.01"
          value={charges.roundOff}
          onChange={(event) => updateChargesDiscount({ roundOff: numberFromInput(event.target.value) })}
          className="mt-1 w-full rounded-md border border-[#d2d2d7] bg-white px-2 py-1"
        />
      </label>
    </SectionCard>
  );
};
