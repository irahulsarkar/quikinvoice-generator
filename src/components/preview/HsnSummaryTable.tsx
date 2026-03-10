import type { HsnSummaryRow } from '../../types/invoice';
import { formatInrNumber } from '../../utils/currency';

interface HsnSummaryTableProps {
  rows: HsnSummaryRow[];
}

export const HsnSummaryTable = ({ rows }: HsnSummaryTableProps) => {
  if (!rows.length) {
    return null;
  }

  return (
    <div className="table-scroll-wrap mt-3">
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr className="bg-[#f1f5f9] text-[#334155]">
            <th className="border border-[#cbd5e1] px-2 py-1 text-left">HSN / SAC</th>
            <th className="border border-[#cbd5e1] px-2 py-1 text-right">Taxable Value</th>
            <th className="border border-[#cbd5e1] px-2 py-1 text-right">Tax</th>
            <th className="border border-[#cbd5e1] px-2 py-1 text-right">Total Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.hsnSac}>
              <td className="border border-[#cbd5e1] px-2 py-1">{row.hsnSac}</td>
              <td className="border border-[#cbd5e1] px-2 py-1 text-right">{formatInrNumber(row.taxableValue)}</td>
              <td className="border border-[#cbd5e1] px-2 py-1 text-right">{formatInrNumber(row.totalTax)}</td>
              <td className="border border-[#cbd5e1] px-2 py-1 text-right">{formatInrNumber(row.totalValue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
