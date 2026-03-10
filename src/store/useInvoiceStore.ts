import { create } from 'zustand';
import { demoInvoiceDraft } from '../constants/demoData';
import type {
  BuyerDetails,
  ChargeRule,
  ChargesDiscount,
  InvoiceDraft,
  InvoiceMeta,
  LayoutSettings,
  LineItem,
  PaymentDetails,
  SellerDetails,
  TaxMode,
  ValidationIssue,
} from '../types/invoice';
import { calculateGrandTotal } from '../utils/calc';
import type { FullComputation } from '../utils/calc';
import { determineTaxMode } from '../utils/gst';
import { collectValidationIssues } from '../utils/invoiceValidation';

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `line-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

const today = new Date().toISOString().slice(0, 10);

const defaultSeller: SellerDetails = {
  tradeName: '',
  legalName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  stateCode: '29',
  pinCode: '',
  phone: '',
  email: '',
  pan: '',
  gstin: '',
  isUnregistered: false,
  logoDataUrl: '',
  jurisdiction: '',
  signatureDataUrl: '',
};

const defaultBuyer: BuyerDetails = {
  buyerName: '',
  companyName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  stateCode: '29',
  pinCode: '',
  phone: '',
  email: '',
  pan: '',
  gstin: '',
  placeOfSupplyCode: '29',
  isUnregistered: false,
};

const defaultInvoiceMeta: InvoiceMeta = {
  invoiceNumber: '',
  invoiceDate: today,
  dueDate: '',
  reverseCharge: false,
  supplyType: 'goods',
  currency: 'INR',
  notes: '',
  terms: '',
  eWayBill: '',
  poNumber: '',
  deliveryNote: '',
  reference: '',
};

const defaultLineItem = (): LineItem => ({
  id: createId(),
  type: 'goods',
  name: '',
  description: '',
  hsnSac: '',
  unit: 'Nos',
  quantity: 1,
  rate: 0,
  taxRate: 18,
  discountMode: 'flat',
  discountValue: 0,
});

const defaultChargesDiscount: ChargesDiscount = {
  shipping: {
    enabled: false,
    mode: 'flat',
    value: 0,
    taxable: true,
    beforeTax: true,
  },
  packing: {
    enabled: false,
    mode: 'flat',
    value: 0,
    taxable: true,
    beforeTax: true,
  },
  additional: {
    enabled: false,
    mode: 'flat',
    value: 0,
    taxable: false,
    beforeTax: false,
  },
  overallDiscount: {
    enabled: false,
    mode: 'flat',
    value: 0,
    beforeTax: true,
  },
  roundOff: 0,
};

const defaultPaymentDetails: PaymentDetails = {
  bankAccountName: '',
  bankName: '',
  accountNumber: '',
  ifsc: '',
  branch: '',
  upiId: '',
  paymentTerms: '',
  showBankDetails: true,
  showUpiQr: false,
};

export const defaultLayoutSettings: LayoutSettings = {
  pageSize: 'A4',
  orientation: 'portrait',
  marginPreset: 'medium',
  customMarginMm: 12,
  autoFit: true,
  fontScale: 1,
  compactMode: false,
  showSellerLogo: true,
  showBuyerGSTIN: true,
  showBuyerPAN: false,
  showHSN: true,
  showTaxRate: true,
  showLineDiscount: true,
  showBankDetails: true,
  showUpiQr: true,
  showNotes: true,
  showJurisdiction: true,
  showSignatureBlock: true,
  showTaxSummary: true,
  showHsnSummary: true,
  showPageNumbers: true,
  showAuthorizedSignatory: true,
  showAmountInWords: true,
  footerText: 'GST-ready invoice generator. Verify commercial usage with your CA/tax professional.',
  signatureAlignment: 'right',
  invoiceTheme: 'classic',
  storageMode: 'session',
  darkMode: false,
};

const createDefaultDraft = (): InvoiceDraft => ({
  seller: defaultSeller,
  buyer: defaultBuyer,
  invoiceMeta: defaultInvoiceMeta,
  lineItems: [defaultLineItem()],
  chargesDiscount: defaultChargesDiscount,
  paymentDetails: defaultPaymentDetails,
  layoutSettings: defaultLayoutSettings,
});

const normalizeDraft = (draft: Partial<InvoiceDraft>): InvoiceDraft => ({
  seller: {
    ...defaultSeller,
    ...(draft.seller ?? {}),
    isUnregistered: draft.seller?.isUnregistered ?? false,
  },
  buyer: {
    ...defaultBuyer,
    ...(draft.buyer ?? {}),
    isUnregistered: draft.buyer?.isUnregistered ?? false,
  },
  invoiceMeta: {
    ...defaultInvoiceMeta,
    ...(draft.invoiceMeta ?? {}),
  },
  lineItems: draft.lineItems?.length
    ? draft.lineItems.map((item) => ({ ...defaultLineItem(), ...item, id: item.id || createId() }))
    : [defaultLineItem()],
  chargesDiscount: {
    ...defaultChargesDiscount,
    ...(draft.chargesDiscount ?? {}),
    shipping: {
      ...defaultChargesDiscount.shipping,
      ...(draft.chargesDiscount?.shipping ?? {}),
    },
    packing: {
      ...defaultChargesDiscount.packing,
      ...(draft.chargesDiscount?.packing ?? {}),
    },
    additional: {
      ...defaultChargesDiscount.additional,
      ...(draft.chargesDiscount?.additional ?? {}),
    },
    overallDiscount: {
      ...defaultChargesDiscount.overallDiscount,
      ...(draft.chargesDiscount?.overallDiscount ?? {}),
    },
  },
  paymentDetails: {
    ...defaultPaymentDetails,
    ...(draft.paymentDetails ?? {}),
  },
  layoutSettings: {
    ...defaultLayoutSettings,
    ...(draft.layoutSettings ?? {}),
    darkMode: false,
  },
});

const computeDerived = (draft: InvoiceDraft) => {
  const taxMode: TaxMode = determineTaxMode(draft.seller, draft.buyer);
  const computation = calculateGrandTotal({
    lineItems: draft.lineItems,
    charges: draft.chargesDiscount,
    taxMode,
  });
  const validationIssues = collectValidationIssues(draft);

  return {
    taxMode,
    ...computation,
    validationIssues,
  };
};

interface DerivedState extends FullComputation {
  taxMode: TaxMode;
  validationIssues: ValidationIssue[];
}

type ChargesDiscountPatch = {
  shipping?: Partial<ChargeRule>;
  packing?: Partial<ChargeRule>;
  additional?: Partial<ChargeRule>;
  overallDiscount?: Partial<ChargesDiscount['overallDiscount']>;
  roundOff?: number;
};

interface InvoiceStore extends InvoiceDraft {
  derived: DerivedState;
  hydrated: boolean;
  savedBuyer?: BuyerDetails;
  actions: {
    updateSeller: (partial: Partial<SellerDetails>) => void;
    updateBuyer: (partial: Partial<BuyerDetails>) => void;
    saveCurrentBuyer: () => void;
    restoreSavedBuyer: () => void;
    updateInvoiceMeta: (partial: Partial<InvoiceMeta>) => void;
    addLineItem: (item?: Partial<LineItem>) => void;
    updateLineItem: (id: string, partial: Partial<LineItem>) => void;
    deleteLineItem: (id: string) => void;
    duplicateLineItem: (id: string) => void;
    reorderLineItem: (id: string, direction: 'up' | 'down') => void;
    updateChargesDiscount: (partial: ChargesDiscountPatch) => void;
    updatePaymentDetails: (partial: Partial<PaymentDetails>) => void;
    updateLayoutSettings: (partial: Partial<LayoutSettings>) => void;
    setDraft: (draft: InvoiceDraft) => void;
    resetInvoice: () => void;
    loadDemoData: () => void;
    setHydrated: (value: boolean) => void;
    getDraft: () => InvoiceDraft;
  };
}

const withDerived = (draft: Partial<InvoiceDraft>) => {
  const normalizedDraft = normalizeDraft(draft);
  const derived = computeDerived(normalizedDraft);
  return {
    ...normalizedDraft,
    derived,
  };
};

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  ...withDerived(createDefaultDraft()),
  hydrated: false,
  savedBuyer: undefined,
  actions: {
    updateSeller: (partial) => {
      set((state) => withDerived({ ...state, seller: { ...state.seller, ...partial } }));
    },
    updateBuyer: (partial) => {
      set((state) => withDerived({ ...state, buyer: { ...state.buyer, ...partial } }));
    },
    saveCurrentBuyer: () => {
      const buyer = get().buyer;
      set({ savedBuyer: buyer });
    },
    restoreSavedBuyer: () => {
      const savedBuyer = get().savedBuyer;
      if (!savedBuyer) {
        return;
      }
      set((state) => withDerived({ ...state, buyer: savedBuyer }));
    },
    updateInvoiceMeta: (partial) => {
      set((state) => withDerived({ ...state, invoiceMeta: { ...state.invoiceMeta, ...partial } }));
    },
    addLineItem: (item) => {
      set((state) => {
        const newItem: LineItem = {
          ...defaultLineItem(),
          ...item,
          id: createId(),
        };
        return withDerived({ ...state, lineItems: [...state.lineItems, newItem] });
      });
    },
    updateLineItem: (id, partial) => {
      set((state) => {
        const lineItems = state.lineItems.map((line) => {
          if (line.id !== id) {
            return line;
          }
          const merged = { ...line, ...partial };
          if (merged.type === 'service') {
            return {
              ...merged,
              quantity: 1,
              unit: '',
            };
          }
          return merged;
        });
        return withDerived({ ...state, lineItems });
      });
    },
    deleteLineItem: (id) => {
      set((state) => {
        const next = state.lineItems.filter((line) => line.id !== id);
        const lineItems = next.length ? next : [defaultLineItem()];
        return withDerived({ ...state, lineItems });
      });
    },
    duplicateLineItem: (id) => {
      set((state) => {
        const index = state.lineItems.findIndex((line) => line.id === id);
        if (index < 0) {
          return state;
        }
        const clone = {
          ...state.lineItems[index],
          id: createId(),
        };
        const lineItems = [...state.lineItems];
        lineItems.splice(index + 1, 0, clone);
        return withDerived({ ...state, lineItems });
      });
    },
    reorderLineItem: (id, direction) => {
      set((state) => {
        const index = state.lineItems.findIndex((line) => line.id === id);
        if (index < 0) {
          return state;
        }
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= state.lineItems.length) {
          return state;
        }

        const lineItems = [...state.lineItems];
        const [item] = lineItems.splice(index, 1);
        lineItems.splice(targetIndex, 0, item);

        return withDerived({ ...state, lineItems });
      });
    },
    updateChargesDiscount: (partial) => {
      set((state) => withDerived({
        ...state,
        chargesDiscount: {
          ...state.chargesDiscount,
          ...partial,
          shipping: {
            ...state.chargesDiscount.shipping,
            ...(partial.shipping ?? {}),
          },
          packing: {
            ...state.chargesDiscount.packing,
            ...(partial.packing ?? {}),
          },
          additional: {
            ...state.chargesDiscount.additional,
            ...(partial.additional ?? {}),
          },
          overallDiscount: {
            ...state.chargesDiscount.overallDiscount,
            ...(partial.overallDiscount ?? {}),
          },
        },
      }));
    },
    updatePaymentDetails: (partial) => {
      set((state) => withDerived({ ...state, paymentDetails: { ...state.paymentDetails, ...partial } }));
    },
    updateLayoutSettings: (partial) => {
      set((state) => withDerived({ ...state, layoutSettings: { ...state.layoutSettings, ...partial } }));
    },
    setDraft: (draft) => {
      set(() => withDerived(draft));
    },
    resetInvoice: () => {
      set(() => withDerived(createDefaultDraft()));
    },
    loadDemoData: () => {
      set(() => withDerived(demoInvoiceDraft));
    },
    setHydrated: (value) => {
      set({ hydrated: value });
    },
    getDraft: () => {
      const state = get();
      return {
        seller: state.seller,
        buyer: state.buyer,
        invoiceMeta: state.invoiceMeta,
        lineItems: state.lineItems,
        chargesDiscount: state.chargesDiscount,
        paymentDetails: state.paymentDetails,
        layoutSettings: state.layoutSettings,
      };
    },
  },
}));

export const invoiceSelectors = {
  seller: (state: InvoiceStore) => state.seller,
  buyer: (state: InvoiceStore) => state.buyer,
  invoiceMeta: (state: InvoiceStore) => state.invoiceMeta,
  lineItems: (state: InvoiceStore) => state.lineItems,
  chargesDiscount: (state: InvoiceStore) => state.chargesDiscount,
  paymentDetails: (state: InvoiceStore) => state.paymentDetails,
  layoutSettings: (state: InvoiceStore) => state.layoutSettings,
  validationIssues: (state: InvoiceStore) => state.derived.validationIssues,
  taxMode: (state: InvoiceStore) => state.derived.taxMode,
  totals: (state: InvoiceStore) => state.derived.totals,
  taxSummary: (state: InvoiceStore) => state.derived.taxSummary,
  hsnSummary: (state: InvoiceStore) => state.derived.hsnSummary,
  lineComputations: (state: InvoiceStore) => state.derived.lineComputations,
  actions: (state: InvoiceStore) => state.actions,
};

export const buildDraftFromState = (state: InvoiceStore): InvoiceDraft => ({
  seller: state.seller,
  buyer: state.buyer,
  invoiceMeta: state.invoiceMeta,
  lineItems: state.lineItems,
  chargesDiscount: state.chargesDiscount,
  paymentDetails: state.paymentDetails,
  layoutSettings: state.layoutSettings,
});
