# Indian GST-Ready Invoice Generator (Frontend-Only)

Production-grade React + TypeScript web app for generating GST-ready invoices with a **side-by-side live preview**, strong validation UX, print/PDF export, and session-first persistence.

## Tech Stack

- React 19 + TypeScript + Vite
- TailwindCSS v4
- Zustand (central store)
- React Hook Form + Zod
- html2canvas + jsPDF (lazy-loaded for PDF export)
- QR generation with `qrcode`

## Key Features

- Multi-step builder:
  - Seller details
  - Buyer details
  - Invoice meta
  - Line items/services
  - Charges/discount
  - Payment details
  - Layout/print settings
- GST workflow support:
  - PAN / GSTIN / PIN / phone / IFSC / UPI validations
  - GSTIN PAN consistency checks
  - GSTIN state-prefix mismatch warnings
  - Intra-state vs inter-state GST auto mode (CGST+SGST vs IGST)
  - Place of supply based logic
- Items engine:
  - Goods vs service behavior
  - Dynamic add/edit/delete/duplicate/reorder
  - Per-line taxable calculations
- Totals and summaries:
  - GST summary table
  - HSN/SAC-wise summary
  - Grand total + round-off
  - **Amount in Words** in Indian format (Thousand/Lakh/Crore)
- Print/PDF:
  - A4/Letter, portrait/landscape
  - Multi-page page-sliced rendering
  - Page numbering
  - Clean print CSS
- Persistence:
  - Debounced autosave to `sessionStorage` by default
  - Optional explicit switch to `localStorage`
  - Import/export draft JSON
- UI/UX:
  - Responsive desktop-first two-column layout
  - Sticky live preview pane
  - Dark mode
  - Seller logo + signature upload (drag/drop)
  - Optional UPI QR + bank details

## Compliance Note

This app is **GST-ready** and designed around common GST tax invoice data requirements. Always verify final commercial/legal usage and edge-case compliance with your CA or tax professional.

## Project Structure

```text
src/
  components/
    common/
      FormField.tsx
      LogoUploader.tsx
      PrintToolbar.tsx
      QrGenerator.tsx
      SectionCard.tsx
      StateSelect.tsx
      Toggle.tsx
      TotalsCard.tsx
      ValidationSummary.tsx
    forms/
      BuyerDetailsForm.tsx
      ChargesDiscountPanel.tsx
      InvoiceMetaForm.tsx
      LayoutSettingsPanel.tsx
      LineItemsEditor.tsx
      PaymentDetailsForm.tsx
      SellerDetailsForm.tsx
      formStyles.ts
    layout/
      AppShell.tsx
      InvoiceBuilderLayout.tsx
    preview/
      HsnSummaryTable.tsx
      InvoicePage.tsx
      InvoicePreview.tsx
      TaxSummaryTable.tsx
  constants/
    demoData.ts
    indianStates.ts
  hooks/
    useDebouncedEffect.ts
  store/
    useInvoiceStore.ts
  types/
    invoice.ts
  utils/
    calc.ts
    currency.ts
    gst.ts
    invoiceValidation.ts
    pagination.ts
    pdf.ts
    storage.ts
    validators.ts
  validation/
    schemas.ts
  App.tsx
  index.css
  main.tsx
```

## Run Locally

```bash
npm install
npm run dev
```

Build production bundle:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

## Notes

- Buyer/client logo support is intentionally removed.
- Only seller/company logo appears in preview/print.
- Printing and PDF export are blocked if mandatory invoice sections are invalid.
- Amount in words updates instantly with total changes and can be toggled in layout settings.
