import type { InvoiceDraft, LayoutSettings, LineComputation, LineItem } from '../../types/invoice';
import type { FullComputation } from '../../utils/calc';
import { getStateByGstCode } from '../../constants/indianStates';
import { formatInr, formatInrNumber } from '../../utils/currency';
import { QrGenerator } from '../common/QrGenerator';
import { HsnSummaryTable } from './HsnSummaryTable';
import { TaxSummaryTable } from './TaxSummaryTable';

interface InvoicePageProps {
  pageItems: LineItem[];
  pageIndex: number;
  totalPages: number;
  draft: InvoiceDraft;
  derived: FullComputation & { taxMode: 'intra' | 'inter' | 'export' };
  layout: LayoutSettings;
  isLastPage: boolean;
}

const getThemeClass = (theme: LayoutSettings['invoiceTheme']) => {
  if (theme === 'modern') {
    return 'invoice-theme-modern';
  }
  if (theme === 'minimal') {
    return 'invoice-theme-minimal';
  }
  return 'invoice-theme-classic';
};

const getMarginMm = (layout: LayoutSettings) => {
  if (layout.marginPreset === 'small') {
    return 8;
  }
  if (layout.marginPreset === 'large') {
    return 16;
  }
  if (layout.marginPreset === 'custom') {
    return layout.customMarginMm;
  }
  return 12;
};

export const InvoicePage = ({
  pageItems,
  pageIndex,
  totalPages,
  draft,
  derived,
  layout,
  isLastPage,
}: InvoicePageProps) => {
  const { seller, buyer, invoiceMeta, paymentDetails } = draft;
  const margin = getMarginMm(layout);
  const sellerState = getStateByGstCode(seller.stateCode)?.name;
  const buyerState = getStateByGstCode(buyer.stateCode)?.name;
  const placeOfSupplyState = getStateByGstCode(buyer.placeOfSupplyCode)?.name;

  return (
    <article
      className={`invoice-page ${getThemeClass(layout.invoiceTheme)} ${layout.orientation === 'landscape' ? 'landscape' : ''}`}
      style={{
        padding: `${margin}mm`,
        fontSize: `${layout.fontScale * 12}px`,
      }}
    >
      <header className="invoice-header">
        <div>
          <p className="invoice-title">Tax Invoice</p>
          <p className="invoice-subtitle">Made with QuikInvoice.</p>
        </div>
        <div className="invoice-meta-grid">
          <div><span>Invoice No:</span> <strong>{invoiceMeta.invoiceNumber || '-'}</strong></div>
          <div><span>Date:</span> <strong>{invoiceMeta.invoiceDate || '-'}</strong></div>
          <div><span>Due Date:</span> <strong>{invoiceMeta.dueDate || '-'}</strong></div>
          <div><span>Reverse Charge:</span> <strong>{invoiceMeta.reverseCharge ? 'Yes' : 'No'}</strong></div>
        </div>
      </header>

      <section className="invoice-party-grid">
        <div className="invoice-party-card">
          <h3>Supplier</h3>
          <div className="party-head">
            {layout.showSellerLogo && seller.logoDataUrl ? <img src={seller.logoDataUrl} alt="Seller logo" className="seller-logo" /> : null}
            <div>
              <p className="party-name">{seller.tradeName || '-'}</p>
              {seller.legalName ? <p className="text-xs">{seller.legalName}</p> : null}
            </div>
          </div>
          <p>{seller.addressLine1}</p>
          {seller.addressLine2 ? <p>{seller.addressLine2}</p> : null}
          <p>{seller.city} {seller.pinCode}</p>
          <p>{sellerState} ({seller.stateCode})</p>
          <p>GSTIN: {seller.isUnregistered ? 'Unregistered' : seller.gstin || '-'}</p>
          <p>PAN: {seller.isUnregistered ? 'Not available' : seller.pan || '-'}</p>
          {layout.showJurisdiction && seller.jurisdiction ? <p>Jurisdiction: {seller.jurisdiction}</p> : null}
        </div>

        <div className="invoice-party-card">
          <h3>Buyer</h3>
          <p className="party-name">{buyer.buyerName || '-'}</p>
          {buyer.companyName ? <p>{buyer.companyName}</p> : null}
          <p>{buyer.addressLine1}</p>
          {buyer.addressLine2 ? <p>{buyer.addressLine2}</p> : null}
          <p>{buyer.city} {buyer.pinCode}</p>
          <p>{buyerState} ({buyer.stateCode})</p>
          {layout.showBuyerGSTIN ? <p>GSTIN: {buyer.gstin || (buyer.isUnregistered ? 'Unregistered' : '-')}</p> : null}
          {layout.showBuyerPAN ? <p>PAN: {buyer.pan || '-'}</p> : null}
          <p>Place of Supply: {placeOfSupplyState || buyer.placeOfSupplyCode}</p>
        </div>
      </section>

      <section className="invoice-items-wrap">
        <div className="table-scroll-wrap">
          <table className="invoice-items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                {layout.showHSN ? <th>HSN/SAC</th> : null}
                <th>Qty</th>
                <th>Rate</th>
                {layout.showLineDiscount ? <th>Disc</th> : null}
                <th>Taxable</th>
                {layout.showTaxRate ? <th>Tax %</th> : null}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((line, index) => {
                const computed: LineComputation | undefined = derived.lineComputations[line.id];
                return (
                  <tr key={line.id}>
                    <td>{pageIndex * 100 + index + 1}</td>
                    <td>
                      <p>{line.name || '-'}</p>
                      {line.description ? <p className="muted">{line.description}</p> : null}
                      <p className="muted">{line.type === 'service' ? 'Service' : `Unit: ${line.unit || 'Nos'}`}</p>
                    </td>
                    {layout.showHSN ? <td>{line.hsnSac || '-'}</td> : null}
                    <td>{line.type === 'service' ? '-' : line.quantity}</td>
                    <td>{formatInrNumber(line.rate)}</td>
                    {layout.showLineDiscount ? <td>{line.discountMode === 'percent' ? `${line.discountValue}%` : formatInrNumber(line.discountValue)}</td> : null}
                    <td>{formatInrNumber(computed?.lineTaxableValue ?? 0)}</td>
                    {layout.showTaxRate ? <td>{line.taxRate.toFixed(2)}</td> : null}
                    <td>{formatInrNumber(computed?.totalLineValue ?? 0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {isLastPage ? (
        <>
          <section className="invoice-totals-grid">
            <div className="invoice-summary-card">
              {layout.showAmountInWords ? (
                <p className="amount-words"><strong>Amount in words:</strong> {derived.totals.amountInWords}</p>
              ) : null}

              {layout.showBankDetails && paymentDetails.showBankDetails ? (
                <div className="bank-details">
                  <p className="summary-heading">Bank Details</p>
                  <p>A/C Name: {paymentDetails.bankAccountName || '-'}</p>
                  <p>Bank: {paymentDetails.bankName || '-'}</p>
                  <p>A/C No: {paymentDetails.accountNumber || '-'}</p>
                  <p>IFSC: {paymentDetails.ifsc || '-'}</p>
                  {paymentDetails.branch ? <p>Branch: {paymentDetails.branch}</p> : null}
                  {paymentDetails.paymentTerms ? <p>Terms: {paymentDetails.paymentTerms}</p> : null}
                </div>
              ) : null}

              {layout.showUpiQr && paymentDetails.showUpiQr ? (
                <QrGenerator
                  enabled={Boolean(paymentDetails.upiId)}
                  upiId={paymentDetails.upiId}
                  payeeName={seller.tradeName}
                  amount={derived.totals.grandTotal}
                />
              ) : null}
            </div>

            <div className="invoice-summary-card">
              <p><span>Subtotal</span><strong>{formatInr(derived.totals.subtotal)}</strong></p>
              <p><span>Line Discount</span><strong>{formatInr(derived.totals.lineDiscountTotal)}</strong></p>
              <p><span>Taxable Value</span><strong>{formatInr(derived.totals.taxableSubtotal)}</strong></p>
              {derived.taxMode === 'intra' ? (
                <>
                  <p><span>CGST</span><strong>{formatInr(derived.totals.cgstAmount)}</strong></p>
                  <p><span>SGST</span><strong>{formatInr(derived.totals.sgstAmount)}</strong></p>
                </>
              ) : (
                <p><span>IGST</span><strong>{formatInr(derived.totals.igstAmount)}</strong></p>
              )}
              <p className="grand-total"><span>Grand Total</span><strong>{formatInr(derived.totals.grandTotal)}</strong></p>
            </div>
          </section>

          {layout.showTaxSummary ? (
            <section>
              <h4 className="table-heading">GST Summary</h4>
              <TaxSummaryTable rows={derived.taxSummary} />
            </section>
          ) : null}

          {layout.showHsnSummary ? (
            <section>
              <h4 className="table-heading">HSN/SAC Summary</h4>
              <HsnSummaryTable rows={derived.hsnSummary} />
            </section>
          ) : null}

          {layout.showNotes ? (
            <section className="invoice-notes">
              {invoiceMeta.notes ? <p><strong>Notes:</strong> {invoiceMeta.notes}</p> : null}
              {invoiceMeta.terms ? <p><strong>Terms:</strong> {invoiceMeta.terms}</p> : null}
            </section>
          ) : null}

          {layout.showSignatureBlock ? (
            <section className={`invoice-signature ${layout.signatureAlignment}`}>
              {seller.signatureDataUrl ? <img src={seller.signatureDataUrl} alt="Signature" className="signature-image" /> : null}
              {layout.showAuthorizedSignatory ? <p>Authorised Signatory</p> : null}
            </section>
          ) : null}
        </>
      ) : null}

      <footer className="invoice-footer">
        <p>{layout.footerText}</p>
        {layout.showPageNumbers ? <p>Page {pageIndex + 1} of {totalPages}</p> : null}
      </footer>
    </article>
  );
};
