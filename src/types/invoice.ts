export type SupplyType = 'goods' | 'services' | 'mixed';
export type ItemType = 'goods' | 'service';
export type AdjustmentMode = 'flat' | 'percent';
export type TaxMode = 'intra' | 'inter' | 'export';

export interface AddressFields {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode: string;
  pinCode: string;
}

export interface SellerDetails extends AddressFields {
  tradeName: string;
  legalName?: string;
  phone: string;
  email?: string;
  pan: string;
  gstin: string;
  isUnregistered: boolean;
  logoDataUrl?: string;
  jurisdiction?: string;
  signatureDataUrl?: string;
}

export interface BuyerDetails extends AddressFields {
  buyerName: string;
  companyName?: string;
  phone: string;
  email?: string;
  pan?: string;
  gstin?: string;
  placeOfSupplyCode: string;
  isUnregistered: boolean;
}

export interface InvoiceMeta {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  reverseCharge: boolean;
  supplyType: SupplyType;
  currency: 'INR';
  notes?: string;
  terms?: string;
  eWayBill?: string;
  poNumber?: string;
  deliveryNote?: string;
  reference?: string;
}

export interface LineItem {
  id: string;
  type: ItemType;
  name: string;
  description?: string;
  hsnSac: string;
  unit: string;
  quantity: number;
  rate: number;
  taxRate: number;
  discountMode: AdjustmentMode;
  discountValue: number;
}

export interface ChargeRule {
  enabled: boolean;
  mode: AdjustmentMode;
  value: number;
  taxable: boolean;
  beforeTax: boolean;
}

export interface ChargesDiscount {
  shipping: ChargeRule;
  packing: ChargeRule;
  additional: ChargeRule;
  overallDiscount: {
    enabled: boolean;
    mode: AdjustmentMode;
    value: number;
    beforeTax: boolean;
  };
  roundOff: number;
}

export interface PaymentDetails {
  bankAccountName: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  branch?: string;
  upiId?: string;
  paymentTerms?: string;
  showBankDetails: boolean;
  showUpiQr: boolean;
}

export type InvoiceTheme = 'classic' | 'modern' | 'minimal';

export interface LayoutSettings {
  pageSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  marginPreset: 'small' | 'medium' | 'large' | 'custom';
  customMarginMm: number;
  autoFit: boolean;
  fontScale: number;
  compactMode: boolean;
  showSellerLogo: boolean;
  showBuyerGSTIN: boolean;
  showBuyerPAN: boolean;
  showHSN: boolean;
  showTaxRate: boolean;
  showLineDiscount: boolean;
  showBankDetails: boolean;
  showUpiQr: boolean;
  showNotes: boolean;
  showJurisdiction: boolean;
  showSignatureBlock: boolean;
  showTaxSummary: boolean;
  showHsnSummary: boolean;
  showPageNumbers: boolean;
  showAuthorizedSignatory: boolean;
  showAmountInWords: boolean;
  footerText: string;
  signatureAlignment: 'left' | 'center' | 'right';
  invoiceTheme: InvoiceTheme;
  storageMode: 'session' | 'local';
  darkMode: boolean;
}

export interface TaxSummaryRow {
  rate: number;
  taxableValue: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalTax: number;
}

export interface HsnSummaryRow {
  hsnSac: string;
  taxableValue: number;
  totalTax: number;
  totalValue: number;
}

export interface LineComputation {
  lineBaseAmount: number;
  lineDiscountAmount: number;
  lineTaxableValue: number;
  taxAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalLineValue: number;
}

export interface InvoiceTotals {
  subtotal: number;
  lineDiscountTotal: number;
  taxableSubtotal: number;
  chargeBeforeTaxTotal: number;
  chargeAfterTaxTotal: number;
  overallDiscountAmount: number;
  taxAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  grandTotalBeforeRoundOff: number;
  roundOff: number;
  grandTotal: number;
  amountInWords: string;
}

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface InvoiceDraft {
  seller: SellerDetails;
  buyer: BuyerDetails;
  invoiceMeta: InvoiceMeta;
  lineItems: LineItem[];
  chargesDiscount: ChargesDiscount;
  paymentDetails: PaymentDetails;
  layoutSettings: LayoutSettings;
}

export interface PaginatedInvoice {
  pages: LineItem[][];
  totalPages: number;
}
