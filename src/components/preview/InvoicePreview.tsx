import { forwardRef, useMemo } from 'react';
import { invoiceSelectors, useInvoiceStore } from '../../store/useInvoiceStore';
import { paginateInvoiceContentForPrint } from '../../utils/pagination';
import { InvoicePage } from './InvoicePage';

export const InvoicePreview = forwardRef<HTMLDivElement>(function InvoicePreview(_, ref) {
  const seller = useInvoiceStore(invoiceSelectors.seller);
  const buyer = useInvoiceStore(invoiceSelectors.buyer);
  const invoiceMeta = useInvoiceStore(invoiceSelectors.invoiceMeta);
  const lineItems = useInvoiceStore(invoiceSelectors.lineItems);
  const chargesDiscount = useInvoiceStore(invoiceSelectors.chargesDiscount);
  const paymentDetails = useInvoiceStore(invoiceSelectors.paymentDetails);
  const layoutSettings = useInvoiceStore(invoiceSelectors.layoutSettings);
  const taxSummary = useInvoiceStore(invoiceSelectors.taxSummary);
  const hsnSummary = useInvoiceStore(invoiceSelectors.hsnSummary);
  const lineComputations = useInvoiceStore(invoiceSelectors.lineComputations);
  const totals = useInvoiceStore(invoiceSelectors.totals);
  const taxMode = useInvoiceStore(invoiceSelectors.taxMode);

  const pagination = useMemo(() => paginateInvoiceContentForPrint(lineItems, layoutSettings), [lineItems, layoutSettings]);

  return (
    <div ref={ref} className="preview-scroll-x space-y-5 overflow-x-auto pb-8" id="invoice-preview">
      {pagination.pages.map((pageItems, index) => (
        <div key={`page-${index + 1}`} className="flex justify-center">
          <InvoicePage
            pageItems={pageItems}
            pageIndex={index}
            totalPages={pagination.totalPages}
            draft={{
              seller,
              buyer,
              invoiceMeta,
              lineItems,
              chargesDiscount,
              paymentDetails,
              layoutSettings,
            }}
            derived={{
              taxMode,
              taxSummary,
              hsnSummary,
              lineComputations,
              totals,
            }}
            layout={layoutSettings}
            isLastPage={index === pagination.totalPages - 1}
          />
        </div>
      ))}
    </div>
  );
});
