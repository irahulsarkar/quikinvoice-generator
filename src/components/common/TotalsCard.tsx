import { formatInr } from '../../utils/currency';
import type { InvoiceTotals } from '../../types/invoice';

interface TotalsCardProps {
  totals: InvoiceTotals;
  taxMode: 'intra' | 'inter' | 'export';
  showAmountInWords: boolean;
}

export const TotalsCard = ({ totals, taxMode, showAmountInWords }: TotalsCardProps) => {
  return (
    <aside className="responsive-totals-card rounded-2xl border border-[#d2d2d7] bg-[#fbfbfd] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-[#3a3a3c]">Totals</h3>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-[#6e6e73]">Subtotal</dt>
          <dd className="font-medium">{formatInr(totals.subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-[#6e6e73]">Line discount</dt>
          <dd className="font-medium">- {formatInr(totals.lineDiscountTotal)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-[#6e6e73]">Taxable value</dt>
          <dd className="font-medium">{formatInr(totals.taxableSubtotal)}</dd>
        </div>
        {taxMode === 'intra' ? (
          <>
            <div className="flex items-center justify-between">
              <dt className="text-[#6e6e73]">CGST</dt>
              <dd className="font-medium">{formatInr(totals.cgstAmount)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[#6e6e73]">SGST</dt>
              <dd className="font-medium">{formatInr(totals.sgstAmount)}</dd>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <dt className="text-[#6e6e73]">IGST</dt>
            <dd className="font-medium">{formatInr(totals.igstAmount)}</dd>
          </div>
        )}

        <div className="mt-2 border-t border-[#d2d2d7] pt-2">
          <div className="flex items-center justify-between">
            <dt className="text-[#3a3a3c]">Grand Total</dt>
            <dd className="text-lg font-semibold text-[#1d1d1f]">{formatInr(totals.grandTotal)}</dd>
          </div>
        </div>

        {showAmountInWords ? (
          <div className="mt-2 rounded-xl bg-[#f5f5f7] p-2 text-xs text-[#6e6e73]">
            <span className="font-medium">Amount in words: </span>
            {totals.amountInWords}
          </div>
        ) : null}
      </dl>
    </aside>
  );
};
