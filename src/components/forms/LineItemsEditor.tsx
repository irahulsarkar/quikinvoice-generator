import { useState } from 'react';
import { invoiceSelectors, useInvoiceStore } from '../../store/useInvoiceStore';
import { formatInrNumber } from '../../utils/currency';
import { SectionCard } from '../common/SectionCard';
import { TotalsCard } from '../common/TotalsCard';

const units = ['Nos', 'Kg', 'Ltr', 'Box', 'Pack', 'Hour', 'Day', 'Job'];

const parseNumber = (value: string) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return parsed;
};

const fieldClassName = 'w-full rounded-xl border border-[#d2d2d7] bg-white px-3 py-2 text-sm text-[#1d1d1f] outline-none transition focus:border-[#0071e3] focus:ring-2 focus:ring-[#d9ecff]';
const labelClassName = 'space-y-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]';

export const LineItemsEditor = () => {
  const lineItems = useInvoiceStore(invoiceSelectors.lineItems);
  const lineComputations = useInvoiceStore(invoiceSelectors.lineComputations);
  const totals = useInvoiceStore(invoiceSelectors.totals);
  const taxMode = useInvoiceStore(invoiceSelectors.taxMode);
  const layoutSettings = useInvoiceStore(invoiceSelectors.layoutSettings);
  const { addLineItem, updateLineItem, deleteLineItem, duplicateLineItem, reorderLineItem } = useInvoiceStore(invoiceSelectors.actions);

  const [manuallyOpenedLineItemId, setManuallyOpenedLineItemId] = useState<string | null>(null);
  const openLineItemId = lineItems.some((line) => line.id === manuallyOpenedLineItemId)
    ? manuallyOpenedLineItemId
    : (lineItems[0]?.id ?? null);

  return (
    <SectionCard
      title="4) Items / Services"
      subtitle="Dynamic line items with GST and quantity logic"
      actions={(
        <button
          type="button"
          onClick={() => addLineItem()}
          className="rounded-xl bg-[#0071e3] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0065cc]"
        >
          Add line item
        </button>
      )}
    >
      <div className="line-items-layout">
        <div className="space-y-3">
          {lineItems.map((line, index) => {
            const computation = lineComputations[line.id];
            const isOpen = openLineItemId === line.id;
            const nextLineItem = lineItems[index + 1];

            return (
              <article
                key={line.id}
                id={`line-item-${line.id}`}
                className={`rounded-2xl border p-4 transition-colors duration-300 ${isOpen
                  ? 'border-[#cfe0ff] bg-[#f8fbff] shadow-[0_10px_28px_rgba(0,113,227,0.08)]'
                  : 'border-[#e5e5ea] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)]'
                }`}
              >
                <header className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setManuallyOpenedLineItemId((current) => (current === line.id ? null : line.id))}
                    className="inline-flex items-center gap-2 rounded-full border border-[#d2d2d7] bg-[#f5f5f7] px-3 py-1 text-xs font-semibold text-[#1d1d1f]"
                    aria-expanded={isOpen}
                  >
                    <span>Line {index + 1}</span>
                    <span
                      className={`inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#d2d2d7] bg-white text-[10px] text-[#6e6e73] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden
                    >
                      ▾
                    </span>
                  </button>

                  <div className="line-item-actions flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      onClick={() => reorderLineItem(line.id, 'up')}
                      className="rounded-lg border border-[#d2d2d7] bg-white px-2 py-1 text-[11px] font-medium text-[#1d1d1f] transition hover:border-[#a1a1a6]"
                      aria-label={`Move line ${index + 1} up`}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      onClick={() => reorderLineItem(line.id, 'down')}
                      className="rounded-lg border border-[#d2d2d7] bg-white px-2 py-1 text-[11px] font-medium text-[#1d1d1f] transition hover:border-[#a1a1a6]"
                      aria-label={`Move line ${index + 1} down`}
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateLineItem(line.id)}
                      className="rounded-lg border border-[#d2d2d7] bg-white px-2 py-1 text-[11px] font-medium text-[#1d1d1f] transition hover:border-[#a1a1a6]"
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteLineItem(line.id)}
                      className="rounded-lg border border-rose-200 bg-white px-2 py-1 text-[11px] font-medium text-rose-700 transition hover:border-rose-300"
                    >
                      Delete
                    </button>
                  </div>
                </header>

                <div
                  className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${isOpen
                    ? 'mt-3 grid-rows-[1fr] opacity-100'
                    : 'mt-0 grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="form-grid-4">
                      <label className={labelClassName}>
                        Type
                        <select
                          value={line.type}
                          onChange={(event) => updateLineItem(line.id, { type: event.target.value as 'goods' | 'service' })}
                          className={fieldClassName}
                        >
                          <option value="goods">Goods</option>
                          <option value="service">Service</option>
                        </select>
                      </label>

                      <label className={`${labelClassName} md:col-span-2 xl:col-span-3`}>
                        Description
                        <input
                          value={line.name}
                          onChange={(event) => updateLineItem(line.id, { name: event.target.value })}
                          placeholder="Item / service name"
                          className={fieldClassName}
                        />
                      </label>

                      <label className={`${labelClassName} md:col-span-2 xl:col-span-3`}>
                        Detailed description
                        <input
                          value={line.description || ''}
                          onChange={(event) => updateLineItem(line.id, { description: event.target.value })}
                          placeholder="Details (optional)"
                          className={fieldClassName}
                        />
                      </label>

                      <label className={labelClassName}>
                        HSN / SAC
                        <input
                          value={line.hsnSac}
                          onChange={(event) => updateLineItem(line.id, { hsnSac: event.target.value })}
                          className={fieldClassName}
                        />
                      </label>

                      {line.type === 'goods' ? (
                        <label className={labelClassName}>
                          Unit
                          <select
                            value={line.unit}
                            onChange={(event) => updateLineItem(line.id, { unit: event.target.value })}
                            className={fieldClassName}
                          >
                            {units.map((unit) => (
                              <option key={unit} value={unit}>{unit}</option>
                            ))}
                          </select>
                        </label>
                      ) : (
                        <div className={`${labelClassName} rounded-xl border border-[#e5e5ea] bg-[#f5f5f7] px-3 py-2`}>
                          <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">Unit</span>
                          <span className="mt-1 block text-sm font-medium text-[#6e6e73]">Service item</span>
                        </div>
                      )}

                      <label className={labelClassName}>
                        Quantity
                        {line.type === 'goods' ? (
                          <input
                            type="number"
                            min={0}
                            value={line.quantity}
                            onChange={(event) => updateLineItem(line.id, { quantity: parseNumber(event.target.value) })}
                            className={fieldClassName}
                          />
                        ) : (
                          <input
                            value="Not required for services"
                            readOnly
                            className={`${fieldClassName} bg-[#f5f5f7] text-[#6e6e73]`}
                          />
                        )}
                      </label>

                      <label className={labelClassName}>
                        Rate
                        <input
                          type="number"
                          min={0}
                          value={line.rate}
                          onChange={(event) => updateLineItem(line.id, { rate: parseNumber(event.target.value) })}
                          className={fieldClassName}
                        />
                      </label>

                      <label className={labelClassName}>
                        Tax %
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={line.taxRate}
                          onChange={(event) => updateLineItem(line.id, { taxRate: parseNumber(event.target.value) })}
                          className={fieldClassName}
                        />
                      </label>

                      <label className={labelClassName}>
                        Discount Type
                        <select
                          value={line.discountMode}
                          onChange={(event) => updateLineItem(line.id, { discountMode: event.target.value as 'flat' | 'percent' })}
                          className={fieldClassName}
                        >
                          <option value="flat">Flat (Rs)</option>
                          <option value="percent">Percentage (%)</option>
                        </select>
                      </label>

                      <label className={labelClassName}>
                        Discount Value
                        <input
                          type="number"
                          min={0}
                          value={line.discountValue}
                          onChange={(event) => updateLineItem(line.id, { discountValue: parseNumber(event.target.value) })}
                          className={fieldClassName}
                        />
                      </label>

                      <div className="rounded-xl border border-[#d2d2d7] bg-[#fafafc] px-3 py-2 md:col-span-2 xl:col-span-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">Taxable</p>
                            <p className="mt-0.5 font-semibold text-[#1d1d1f]">{formatInrNumber(computation?.lineTaxableValue ?? 0)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">Line total</p>
                            <p className="mt-0.5 font-semibold text-[#1d1d1f]">{formatInrNumber(computation?.totalLineValue ?? 0)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {nextLineItem ? (
                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setManuallyOpenedLineItemId(nextLineItem.id);
                            window.requestAnimationFrame(() => {
                              document.getElementById(`line-item-${nextLineItem.id}`)?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start',
                              });
                            });
                          }}
                          className="inline-flex items-center gap-2 rounded-full border border-[#cfe0ff] bg-[#eaf4ff] px-3 py-1.5 text-xs font-semibold text-[#004b8d] transition hover:border-[#80bfff] hover:bg-[#dff0ff]"
                        >
                          <span>Open Line {index + 2}</span>
                          <span aria-hidden>↓</span>
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <TotalsCard totals={totals} taxMode={taxMode} showAmountInWords={layoutSettings.showAmountInWords} />
      </div>
    </SectionCard>
  );
};
