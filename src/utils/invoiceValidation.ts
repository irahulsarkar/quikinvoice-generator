import type { InvoiceDraft, ValidationIssue } from '../types/invoice';
import { buyerDetailsSchema, invoiceMetaSchema, lineItemsSchema, paymentDetailsSchema, sellerDetailsSchema } from '../validation/schemas';

const flattenIssues = (prefix: string, issues: { path: PropertyKey[]; message: string }[]): ValidationIssue[] => {
  return issues.map((issue) => ({
    path: `${prefix}${issue.path.length ? `.${issue.path.map((segment) => String(segment)).join('.')}` : ''}`,
    message: issue.message,
  }));
};

export const collectValidationIssues = (draft: InvoiceDraft): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];

  const seller = sellerDetailsSchema.safeParse(draft.seller);
  if (!seller.success) {
    issues.push(...flattenIssues('seller', seller.error.issues));
  }

  const buyer = buyerDetailsSchema.safeParse(draft.buyer);
  if (!buyer.success) {
    issues.push(...flattenIssues('buyer', buyer.error.issues));
  }

  const meta = invoiceMetaSchema.safeParse(draft.invoiceMeta);
  if (!meta.success) {
    issues.push(...flattenIssues('invoiceMeta', meta.error.issues));
  }

  const lines = lineItemsSchema.safeParse(draft.lineItems);
  if (!lines.success) {
    issues.push(...flattenIssues('lineItems', lines.error.issues));
  }

  const payment = paymentDetailsSchema.safeParse(draft.paymentDetails);
  if (!payment.success) {
    issues.push(...flattenIssues('paymentDetails', payment.error.issues));
  }

  return issues;
};

export const getBlockingValidationIssues = (draft: InvoiceDraft): ValidationIssue[] => {
  const all = collectValidationIssues(draft);
  return all.filter((issue) => {
    if (issue.path.startsWith('paymentDetails.')) {
      return false;
    }
    return true;
  });
};
