import type {
  ChargesDiscount,
  HsnSummaryRow,
  InvoiceTotals,
  LineComputation,
  LineItem,
  TaxMode,
  TaxSummaryRow,
} from '../types/invoice';
import { numberToIndianCurrencyWords } from './currency';

const safeNumber = (value: number) => (Number.isFinite(value) ? value : 0);

const toRounded = (value: number, precision = 2) => {
  const factor = 10 ** precision;
  return Math.round((safeNumber(value) + Number.EPSILON) * factor) / factor;
};

const computeAdjustmentAmount = (mode: 'flat' | 'percent', value: number, base: number) => {
  if (!value || value < 0) {
    return 0;
  }
  if (mode === 'percent') {
    return (base * value) / 100;
  }
  return value;
};

export const calculateLineBaseAmount = (line: LineItem): number => {
  const rate = Math.max(0, safeNumber(line.rate));
  if (line.type === 'service') {
    return rate;
  }
  const qty = Math.max(0, safeNumber(line.quantity));
  return qty * rate;
};

export const calculateLineTaxableValue = (line: LineItem): number => {
  const base = calculateLineBaseAmount(line);
  const discountAmount = computeAdjustmentAmount(line.discountMode, line.discountValue, base);
  return Math.max(0, base - discountAmount);
};

export const calculateInvoiceSubtotal = (lineItems: LineItem[]): number => {
  return lineItems.reduce((sum, line) => sum + calculateLineBaseAmount(line), 0);
};

export const calculateTaxByLine = (taxableValue: number, taxRate: number, taxMode: TaxMode): Omit<LineComputation, 'lineBaseAmount' | 'lineDiscountAmount' | 'lineTaxableValue' | 'totalLineValue'> => {
  const totalTax = (taxableValue * Math.max(0, taxRate)) / 100;

  if (taxMode === 'intra') {
    const halfTax = totalTax / 2;
    return {
      taxAmount: totalTax,
      cgstAmount: halfTax,
      sgstAmount: halfTax,
      igstAmount: 0,
    };
  }

  return {
    taxAmount: totalTax,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: totalTax,
  };
};

const calculateChargeAmount = (charges: ChargesDiscount, base: number) => {
  const chargeRules = [charges.shipping, charges.packing, charges.additional];

  const beforeTax = chargeRules
    .filter((rule) => rule.enabled && rule.beforeTax)
    .reduce((sum, rule) => sum + computeAdjustmentAmount(rule.mode, rule.value, base), 0);

  const afterTax = chargeRules
    .filter((rule) => rule.enabled && !rule.beforeTax)
    .reduce((sum, rule) => sum + computeAdjustmentAmount(rule.mode, rule.value, base), 0);

  return { beforeTax, afterTax };
};

export interface FullComputation {
  lineComputations: Record<string, LineComputation>;
  taxSummary: TaxSummaryRow[];
  hsnSummary: HsnSummaryRow[];
  totals: InvoiceTotals;
}

export const aggregateTaxSummary = (
  lineItems: LineItem[],
  lineComputations: Record<string, LineComputation>,
  taxMode: TaxMode,
): TaxSummaryRow[] => {
  const bucket = new Map<number, TaxSummaryRow>();

  lineItems.forEach((line) => {
    const comp = lineComputations[line.id];
    if (!comp) {
      return;
    }

    const rate = Math.max(0, safeNumber(line.taxRate));
    const existing = bucket.get(rate) ?? {
      rate,
      taxableValue: 0,
      cgstRate: taxMode === 'intra' ? rate / 2 : 0,
      cgstAmount: 0,
      sgstRate: taxMode === 'intra' ? rate / 2 : 0,
      sgstAmount: 0,
      igstRate: taxMode === 'intra' ? 0 : rate,
      igstAmount: 0,
      totalTax: 0,
    };

    existing.taxableValue += comp.lineTaxableValue;
    existing.cgstAmount += comp.cgstAmount;
    existing.sgstAmount += comp.sgstAmount;
    existing.igstAmount += comp.igstAmount;
    existing.totalTax += comp.taxAmount;

    bucket.set(rate, existing);
  });

  return Array.from(bucket.values())
    .map((row) => ({
      ...row,
      taxableValue: toRounded(row.taxableValue),
      cgstAmount: toRounded(row.cgstAmount),
      sgstAmount: toRounded(row.sgstAmount),
      igstAmount: toRounded(row.igstAmount),
      totalTax: toRounded(row.totalTax),
    }))
    .sort((a, b) => a.rate - b.rate);
};

export const aggregateHsnSummary = (
  lineItems: LineItem[],
  lineComputations: Record<string, LineComputation>,
): HsnSummaryRow[] => {
  const bucket = new Map<string, HsnSummaryRow>();

  lineItems.forEach((line) => {
    const comp = lineComputations[line.id];
    if (!comp) {
      return;
    }

    const hsn = line.hsnSac || 'NA';
    const existing = bucket.get(hsn) ?? {
      hsnSac: hsn,
      taxableValue: 0,
      totalTax: 0,
      totalValue: 0,
    };

    existing.taxableValue += comp.lineTaxableValue;
    existing.totalTax += comp.taxAmount;
    existing.totalValue += comp.totalLineValue;

    bucket.set(hsn, existing);
  });

  return Array.from(bucket.values())
    .map((row) => ({
      ...row,
      taxableValue: toRounded(row.taxableValue),
      totalTax: toRounded(row.totalTax),
      totalValue: toRounded(row.totalValue),
    }))
    .sort((a, b) => a.hsnSac.localeCompare(b.hsnSac));
};

export const calculateGrandTotal = ({
  lineItems,
  charges,
  taxMode,
  precision = 2,
}: {
  lineItems: LineItem[];
  charges: ChargesDiscount;
  taxMode: TaxMode;
  precision?: number;
}): FullComputation => {
  const lineBase = lineItems.map((line) => {
    const lineBaseAmount = calculateLineBaseAmount(line);
    const lineDiscountAmount = computeAdjustmentAmount(line.discountMode, line.discountValue, lineBaseAmount);
    const lineTaxable = Math.max(0, lineBaseAmount - lineDiscountAmount);

    return {
      line,
      lineBaseAmount,
      lineDiscountAmount,
      lineTaxable,
    };
  });

  const subtotal = lineBase.reduce((sum, row) => sum + row.lineBaseAmount, 0);
  const lineDiscountTotal = lineBase.reduce((sum, row) => sum + row.lineDiscountAmount, 0);
  const taxableSubtotalRaw = lineBase.reduce((sum, row) => sum + row.lineTaxable, 0);

  const chargeAmounts = calculateChargeAmount(charges, taxableSubtotalRaw);
  const preTaxDiscountAmount = charges.overallDiscount.enabled && charges.overallDiscount.beforeTax
    ? computeAdjustmentAmount(
      charges.overallDiscount.mode,
      charges.overallDiscount.value,
      taxableSubtotalRaw + chargeAmounts.beforeTax,
    )
    : 0;

  const taxableSubtotal = Math.max(0, taxableSubtotalRaw + chargeAmounts.beforeTax - preTaxDiscountAmount);

  const scalingFactor = taxableSubtotalRaw > 0 ? taxableSubtotal / taxableSubtotalRaw : 1;
  const lineComputations: Record<string, LineComputation> = {};

  lineBase.forEach((row) => {
    const scaledTaxable = row.lineTaxable * scalingFactor;
    const taxes = calculateTaxByLine(scaledTaxable, row.line.taxRate, taxMode);
    const totalLineValue = scaledTaxable + taxes.taxAmount;

    lineComputations[row.line.id] = {
      lineBaseAmount: toRounded(row.lineBaseAmount, precision),
      lineDiscountAmount: toRounded(row.lineDiscountAmount, precision),
      lineTaxableValue: toRounded(scaledTaxable, precision),
      taxAmount: toRounded(taxes.taxAmount, precision),
      cgstAmount: toRounded(taxes.cgstAmount, precision),
      sgstAmount: toRounded(taxes.sgstAmount, precision),
      igstAmount: toRounded(taxes.igstAmount, precision),
      totalLineValue: toRounded(totalLineValue, precision),
    };
  });

  const aggregatedTaxAmount = Object.values(lineComputations).reduce((sum, comp) => sum + comp.taxAmount, 0);
  const cgstAmount = Object.values(lineComputations).reduce((sum, comp) => sum + comp.cgstAmount, 0);
  const sgstAmount = Object.values(lineComputations).reduce((sum, comp) => sum + comp.sgstAmount, 0);
  const igstAmount = Object.values(lineComputations).reduce((sum, comp) => sum + comp.igstAmount, 0);

  const postTaxDiscountAmount = charges.overallDiscount.enabled && !charges.overallDiscount.beforeTax
    ? computeAdjustmentAmount(
      charges.overallDiscount.mode,
      charges.overallDiscount.value,
      taxableSubtotal + aggregatedTaxAmount + chargeAmounts.afterTax,
    )
    : 0;

  const grandTotalBeforeRoundOff = taxableSubtotal + aggregatedTaxAmount + chargeAmounts.afterTax - postTaxDiscountAmount;
  const roundOff = safeNumber(charges.roundOff);
  const grandTotal = grandTotalBeforeRoundOff + roundOff;

  const taxSummary = aggregateTaxSummary(lineItems, lineComputations, taxMode);
  const hsnSummary = aggregateHsnSummary(lineItems, lineComputations);

  const totals: InvoiceTotals = {
    subtotal: toRounded(subtotal, precision),
    lineDiscountTotal: toRounded(lineDiscountTotal, precision),
    taxableSubtotal: toRounded(taxableSubtotal, precision),
    chargeBeforeTaxTotal: toRounded(chargeAmounts.beforeTax, precision),
    chargeAfterTaxTotal: toRounded(chargeAmounts.afterTax, precision),
    overallDiscountAmount: toRounded(preTaxDiscountAmount + postTaxDiscountAmount, precision),
    taxAmount: toRounded(aggregatedTaxAmount, precision),
    cgstAmount: toRounded(cgstAmount, precision),
    sgstAmount: toRounded(sgstAmount, precision),
    igstAmount: toRounded(igstAmount, precision),
    grandTotalBeforeRoundOff: toRounded(grandTotalBeforeRoundOff, precision),
    roundOff: toRounded(roundOff, precision),
    grandTotal: toRounded(grandTotal, precision),
    amountInWords: numberToIndianCurrencyWords(toRounded(grandTotal, precision)),
  };

  return {
    lineComputations,
    taxSummary,
    hsnSummary,
    totals,
  };
};
