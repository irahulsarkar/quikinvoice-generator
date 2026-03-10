import { z } from 'zod';
import { INDIAN_STATES_AND_UTS } from '../constants/indianStates';
import {
  isIfscValid,
  isPanConsistentWithGstin,
  isPhoneValid,
  isPinValid,
  isUpiValid,
  GSTIN_REGEX,
  PAN_REGEX,
} from '../utils/validators';

const stateCodes = INDIAN_STATES_AND_UTS.map((state) => state.gstCode);

const requiredTrimmed = (label: string) => z.string().trim().min(1, `${label} is required`);

const phoneSchema = z
  .string()
  .trim()
  .refine((value) => isPhoneValid(value), 'Enter a valid Indian phone/mobile number');

const pinSchema = z
  .string()
  .trim()
  .refine((value) => isPinValid(value), 'PIN code must be 6 digits');

const stateCodeSchema = z
  .string()
  .trim()
  .refine((value) => stateCodes.includes(value), 'Select a valid state/UT');

const baseAddressSchema = {
  addressLine1: requiredTrimmed('Address line 1'),
  addressLine2: z.string().trim().optional(),
  city: requiredTrimmed('City / District'),
  stateCode: stateCodeSchema,
  pinCode: pinSchema,
};

export const sellerDetailsSchema = z
  .object({
    tradeName: requiredTrimmed('Company / Trade name'),
    legalName: z.string().trim().optional(),
    ...baseAddressSchema,
    phone: phoneSchema,
    email: z.string().trim().email('Enter a valid email').optional().or(z.literal('')),
    pan: z.string().trim().toUpperCase().optional().or(z.literal('')),
    gstin: z.string().trim().toUpperCase().optional().or(z.literal('')),
    isUnregistered: z.boolean(),
    jurisdiction: z.string().trim().optional(),
    logoDataUrl: z.string().optional(),
    signatureDataUrl: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.isUnregistered && !value.pan) {
      ctx.addIssue({
        path: ['pan'],
        code: z.ZodIssueCode.custom,
        message: 'PAN is required unless seller is marked unregistered',
      });
    }

    if (!value.isUnregistered && !value.gstin) {
      ctx.addIssue({
        path: ['gstin'],
        code: z.ZodIssueCode.custom,
        message: 'GSTIN is required unless seller is marked unregistered',
      });
    }

    if (value.pan && !PAN_REGEX.test(value.pan)) {
      ctx.addIssue({
        path: ['pan'],
        code: z.ZodIssueCode.custom,
        message: 'PAN format must be AAAAA9999A',
      });
    }

    if (value.gstin && !GSTIN_REGEX.test(value.gstin)) {
      ctx.addIssue({
        path: ['gstin'],
        code: z.ZodIssueCode.custom,
        message: 'GSTIN format is invalid',
      });
    }

    if (value.gstin && value.pan && !isPanConsistentWithGstin(value.pan, value.gstin)) {
      ctx.addIssue({
        path: ['gstin'],
        code: z.ZodIssueCode.custom,
        message: 'GSTIN PAN segment does not match seller PAN',
      });
    }
  });

export const buyerDetailsSchema = z
  .object({
    buyerName: requiredTrimmed('Buyer name'),
    companyName: z.string().trim().optional(),
    ...baseAddressSchema,
    phone: phoneSchema,
    email: z.string().trim().email('Enter a valid email').optional().or(z.literal('')),
    pan: z.string().trim().toUpperCase().optional().or(z.literal('')),
    gstin: z.string().trim().toUpperCase().optional().or(z.literal('')),
    placeOfSupplyCode: stateCodeSchema,
    isUnregistered: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (value.pan && !PAN_REGEX.test(value.pan)) {
      ctx.addIssue({
        path: ['pan'],
        code: z.ZodIssueCode.custom,
        message: 'PAN format must be AAAAA9999A',
      });
    }

    if (value.gstin && !GSTIN_REGEX.test(value.gstin)) {
      ctx.addIssue({
        path: ['gstin'],
        code: z.ZodIssueCode.custom,
        message: 'GSTIN format is invalid',
      });
    }

    if (value.gstin && value.pan && !isPanConsistentWithGstin(value.pan, value.gstin)) {
      ctx.addIssue({
        path: ['gstin'],
        code: z.ZodIssueCode.custom,
        message: 'Buyer GSTIN PAN segment does not match buyer PAN',
      });
    }

    if (!value.isUnregistered && !value.gstin) {
      ctx.addIssue({
        path: ['gstin'],
        code: z.ZodIssueCode.custom,
        message: 'GSTIN is required unless buyer is marked unregistered',
      });
    }
  });

export const invoiceMetaSchema = z
  .object({
    invoiceNumber: requiredTrimmed('Invoice number'),
    invoiceDate: requiredTrimmed('Invoice date'),
    dueDate: z.string().trim().optional(),
    reverseCharge: z.boolean(),
    supplyType: z.enum(['goods', 'services', 'mixed']),
    currency: z.literal('INR'),
    notes: z.string().trim().optional(),
    terms: z.string().trim().optional(),
    eWayBill: z.string().trim().optional(),
    poNumber: z.string().trim().optional(),
    deliveryNote: z.string().trim().optional(),
    reference: z.string().trim().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.dueDate && value.invoiceDate && value.dueDate < value.invoiceDate) {
      ctx.addIssue({
        path: ['dueDate'],
        code: z.ZodIssueCode.custom,
        message: 'Due date cannot be before invoice date',
      });
    }
  });

export const lineItemSchema = z.object({
  id: z.string(),
  type: z.enum(['goods', 'service']),
  name: requiredTrimmed('Description / item name'),
  description: z.string().trim().optional(),
  hsnSac: requiredTrimmed('HSN / SAC'),
  unit: z.string().trim().optional(),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  rate: z.number().min(0, 'Rate cannot be negative'),
  taxRate: z.number().min(0, 'Tax rate cannot be negative').max(100, 'Tax rate cannot exceed 100'),
  discountMode: z.enum(['flat', 'percent']),
  discountValue: z.number().min(0, 'Discount cannot be negative'),
});

export const lineItemsSchema = z
  .array(lineItemSchema)
  .min(1, 'At least one line item is required')
  .superRefine((items, ctx) => {
    items.forEach((item, index) => {
      if (item.type === 'goods' && item.quantity <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [index, 'quantity'],
          message: 'Quantity is required for goods',
        });
      }
    });
  });

export const paymentDetailsSchema = z.object({
  bankAccountName: z.string().trim().optional(),
  bankName: z.string().trim().optional(),
  accountNumber: z.string().trim().optional(),
  ifsc: z
    .string()
    .trim()
    .toUpperCase()
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || isIfscValid(value), 'Invalid IFSC format'),
  branch: z.string().trim().optional(),
  upiId: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || isUpiValid(value), 'UPI ID format looks invalid'),
  paymentTerms: z.string().trim().optional(),
  showBankDetails: z.boolean(),
  showUpiQr: z.boolean(),
});

export const invoiceDraftSchema = z.object({
  seller: sellerDetailsSchema,
  buyer: buyerDetailsSchema,
  invoiceMeta: invoiceMetaSchema,
  lineItems: lineItemsSchema,
  chargesDiscount: z.any(),
  paymentDetails: paymentDetailsSchema,
  layoutSettings: z.any(),
});

export type SellerDetailsFormValues = z.infer<typeof sellerDetailsSchema>;
export type BuyerDetailsFormValues = z.infer<typeof buyerDetailsSchema>;
export type InvoiceMetaFormValues = z.infer<typeof invoiceMetaSchema>;
export type PaymentDetailsFormValues = z.infer<typeof paymentDetailsSchema>;
