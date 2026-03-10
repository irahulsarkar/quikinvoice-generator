import type { TaxSummaryRow } from '../../types/invoice';
import { formatInrNumber } from '../../utils/currency';

interface TaxSummaryTableProps {
  rows: TaxSummaryRow[];
}

export const TaxSummaryTable = ({ rows }: TaxSummaryTableProps) => {
  if (!rows.length) {
    return null;
  }

  return (
    <div className="table-scroll-wrap mt-3">
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr className="bg-[#f1f5f9] text-[#334155]">
            <th className="border border-[#cbd5e1] px-2 py-1 text-left">Rate %</th>
            <th className="border border-[#cbd5e1] px-2 py-1 text-right">Taxable</th>
            <th className="border border-[#cbd5e1] px-2 py-1 text-right">CGST</th>
            <th className="border border-[#cbd5e1] px-2 py-1 text-right">SGST</th>
            <th className="border border-[#cbd5e1] px-2 py-1 text-right">IGST</th>
            <th className="border border-[#cbd5e1] px-2 py-1 text-right">Total Tax</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.rate}>
              <td className="border border-[#cbd5e1] px-2 py-1">{row.rate.toFixed(2)}</td>
              <td className="border border-[#cbd5e1] px-2 py-1 text-right">{formatInrNumber(row.taxableValue)}</td>
              <td className="border border-[#cbd5e1] px-2 py-1 text-right">{formatInrNumber(row.cgstAmount)}</td>
              <td className="border border-[#cbd5e1] px-2 py-1 text-right">{formatInrNumber(row.sgstAmount)}</td>
              <td className="border border-[#cbd5e1] px-2 py-1 text-right">{formatInrNumber(row.igstAmount)}</td>
              <td className="border border-[#cbd5e1] px-2 py-1 text-right">{formatInrNumber(row.totalTax)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
