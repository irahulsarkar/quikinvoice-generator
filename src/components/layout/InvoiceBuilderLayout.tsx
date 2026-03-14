import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import type { InvoiceDraft } from '../../types/invoice';
import { BuyerDetailsForm } from '../forms/BuyerDetailsForm';
import { ChargesDiscountPanel } from '../forms/ChargesDiscountPanel';
import { InvoiceMetaForm } from '../forms/InvoiceMetaForm';
import { LayoutSettingsPanel } from '../forms/LayoutSettingsPanel';
import { LineItemsEditor } from '../forms/LineItemsEditor';
import { PaymentDetailsForm } from '../forms/PaymentDetailsForm';
import { SellerDetailsForm } from '../forms/SellerDetailsForm';
import { PrintToolbar } from '../common/PrintToolbar';
import { InvoicePreview } from '../preview/InvoicePreview';
import { defaultLayoutSettings, invoiceSelectors, useInvoiceStore } from '../../store/useInvoiceStore';
import { EyeIcon, EyeOffIcon } from '../common/ActionIcons';
import {
  buyerDetailsSchema,
  invoiceMetaSchema,
  lineItemsSchema,
  paymentDetailsSchema,
  sellerDetailsSchema,
} from '../../validation/schemas';

interface InvoiceBuilderLayoutProps {
  previewRef: RefObject<HTMLDivElement | null>;
  canExport: boolean;
  draft: InvoiceDraft;
  onImportDraft: (draft: InvoiceDraft) => void;
}

type SectionKey = 'seller' | 'buyer' | 'meta' | 'items' | 'charges' | 'payment';
type CompletionMap = Record<SectionKey, boolean>;

const SECTION_ORDER: SectionKey[] = ['seller', 'buyer', 'meta', 'items', 'charges', 'payment'];
const SECTION_NEXT: Partial<Record<SectionKey, SectionKey>> = {
  seller: 'buyer',
  buyer: 'meta',
  meta: 'items',
  items: 'charges',
  charges: 'payment',
};

interface AccordionSectionProps {
  sectionId: SectionKey;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  nextLabel?: string;
  onOpenNext?: () => void;
  children: ReactNode;
}

const AccordionSection = ({
  sectionId,
  title,
  isOpen,
  onToggle,
  nextLabel,
  onOpenNext,
  children,
}: AccordionSectionProps) => {
  return (
    <section
      id={`section-${sectionId}`}
      className={`rounded-2xl border p-2 transition-colors duration-300 ${isOpen
        ? 'border-[#cfe0ff] bg-[#f8fbff] shadow-none'
        : 'border-[#e5e5ea] bg-[#f2f3f5] shadow-[0_8px_20px_rgba(15,23,42,0.04)]'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left"
        aria-expanded={isOpen}
      >
        <span className={`text-sm font-semibold ${isOpen ? 'text-[#1d1d1f]' : 'text-[#3a3a3c]'}`}>{title}</span>
        <span
          className={`inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#d2d2d7] bg-white text-xs text-[#6e6e73] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${isOpen
          ? 'mt-2 grid-rows-[1fr] opacity-100'
          : 'mt-0 grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-2 pb-2">
            {children}
            {onOpenNext && nextLabel ? (
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={onOpenNext}
                  className="inline-flex items-center gap-2 rounded-full border border-[#cfe0ff] bg-[#eaf4ff] px-3 py-1.5 text-xs font-semibold text-[#004b8d] transition hover:border-[#80bfff] hover:bg-[#dff0ff]"
                >
                  <span>{nextLabel}</span>
                  <span aria-hidden>↓</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export const InvoiceBuilderLayout = ({
  previewRef,
  canExport,
  draft,
  onImportDraft,
}: InvoiceBuilderLayoutProps) => {
  const currentLayoutSettings = useInvoiceStore(invoiceSelectors.layoutSettings);
  const { updateLayoutSettings, updatePaymentDetails } = useInvoiceStore(invoiceSelectors.actions);

  const [isLayoutDialogOpen, setLayoutDialogOpen] = useState(false);
  const [draftLayoutSettings, setDraftLayoutSettings] = useState(currentLayoutSettings);
  const [isPreviewVisible, setPreviewVisible] = useState(true);

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    seller: true,
    buyer: false,
    meta: false,
    items: false,
    charges: false,
    payment: false,
  });
  const previousCompletionRef = useRef<CompletionMap | null>(null);

  const sectionCompletion = useMemo<CompletionMap>(() => {
    const chargesTouched =
      draft.chargesDiscount.shipping.enabled
      || draft.chargesDiscount.packing.enabled
      || draft.chargesDiscount.additional.enabled
      || draft.chargesDiscount.overallDiscount.enabled
      || draft.chargesDiscount.roundOff !== 0;

    return {
      seller: sellerDetailsSchema.safeParse(draft.seller).success,
      buyer: buyerDetailsSchema.safeParse(draft.buyer).success,
      meta: invoiceMetaSchema.safeParse(draft.invoiceMeta).success,
      items: lineItemsSchema.safeParse(draft.lineItems).success,
      charges: chargesTouched,
      payment: paymentDetailsSchema.safeParse(draft.paymentDetails).success,
    };
  }, [draft.buyer, draft.chargesDiscount, draft.invoiceMeta, draft.lineItems, draft.paymentDetails, draft.seller]);

  useEffect(() => {
    if (!previousCompletionRef.current) {
      previousCompletionRef.current = sectionCompletion;
      return;
    }

    const previous = previousCompletionRef.current;
    previousCompletionRef.current = sectionCompletion;

    const completedNow = SECTION_ORDER.find((key) => !previous[key] && sectionCompletion[key]);
    if (!completedNow) {
      return;
    }

    const nextSection = SECTION_NEXT[completedNow];
    if (!nextSection) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setOpenSections((current) => ({
        ...current,
        [completedNow]: false,
        [nextSection]: true,
      }));
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [sectionCompletion]);

  useEffect(() => {
    if (!isLayoutDialogOpen) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLayoutDialogOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onEscape);
    };
  }, [isLayoutDialogOpen]);

  const toggleSection = (key: SectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const openNextSection = (current: SectionKey, next: SectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [current]: false,
      [next]: true,
    }));

    window.requestAnimationFrame(() => {
      document.getElementById(`section-${next}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  const openLayoutDialog = () => {
    setDraftLayoutSettings(currentLayoutSettings);
    setLayoutDialogOpen(true);
  };

  const closeLayoutDialog = () => {
    setLayoutDialogOpen(false);
  };

  const resetLayoutDraft = () => {
    setDraftLayoutSettings({
      ...defaultLayoutSettings,
      darkMode: false,
    });
  };

  const saveLayoutDraft = () => {
    updateLayoutSettings(draftLayoutSettings);
    updatePaymentDetails({
      showBankDetails: draftLayoutSettings.showBankDetails,
      showUpiQr: draftLayoutSettings.showUpiQr,
    });
    setLayoutDialogOpen(false);
  };

  return (
    <>
      <div className={`responsive-builder-layout ${isPreviewVisible ? 'with-preview' : ''}`}>
        <div className="responsive-main-column space-y-4">
          <div className="rounded-3xl border border-[#e5e5ea] bg-white/90 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur toolbar-card">
            <div className="toolbar-heading-wrap mb-2">
              <p className="toolbar-heading text-xs font-semibold uppercase tracking-[0.16em] text-[#6e6e73]">
                Toolbar
              </p>
            </div>
            <div className="responsive-toolbar-row">
              <PrintToolbar
                canExport={canExport}
                previewVisible={isPreviewVisible}
                previewRef={previewRef}
                draft={draft}
                onImportDraft={onImportDraft}
                onOpenLayoutSettings={openLayoutDialog}
                pageSize={draft.layoutSettings.pageSize}
                orientation={draft.layoutSettings.orientation}
              />
              <button
                type="button"
                onClick={() => setPreviewVisible((value) => !value)}
                className="preview-toggle-btn rounded-lg border border-[#d2d2d7] bg-white px-3 py-2 text-xs font-semibold text-[#3a3a3c] transition hover:border-[#a1a1a6]"
              >
                <span className="inline-flex items-center gap-1.5">
                  {isPreviewVisible ? <EyeOffIcon className="h-3.5 w-3.5" /> : <EyeIcon className="h-3.5 w-3.5" />}
                  {isPreviewVisible ? 'Hide invoice preview' : 'Open invoice preview'}
                </span>
              </button>
            </div>
          </div>

          <AccordionSection
            sectionId="seller"
            title="Seller"
            isOpen={openSections.seller}
            onToggle={() => toggleSection('seller')}
            nextLabel="Open Buyer"
            onOpenNext={() => openNextSection('seller', 'buyer')}
          >
            <SellerDetailsForm />
          </AccordionSection>

          <AccordionSection
            sectionId="buyer"
            title="Buyer"
            isOpen={openSections.buyer}
            onToggle={() => toggleSection('buyer')}
            nextLabel="Open Invoice Meta"
            onOpenNext={() => openNextSection('buyer', 'meta')}
          >
            <BuyerDetailsForm />
          </AccordionSection>

          <AccordionSection
            sectionId="meta"
            title="Invoice Meta"
            isOpen={openSections.meta}
            onToggle={() => toggleSection('meta')}
            nextLabel="Open Items"
            onOpenNext={() => openNextSection('meta', 'items')}
          >
            <InvoiceMetaForm />
          </AccordionSection>

          <AccordionSection
            sectionId="items"
            title="Items"
            isOpen={openSections.items}
            onToggle={() => toggleSection('items')}
            nextLabel="Open Charges & Discounts"
            onOpenNext={() => openNextSection('items', 'charges')}
          >
            <LineItemsEditor />
          </AccordionSection>

          <AccordionSection
            sectionId="charges"
            title="Charges & Discounts"
            isOpen={openSections.charges}
            onToggle={() => toggleSection('charges')}
            nextLabel="Open Payment"
            onOpenNext={() => openNextSection('charges', 'payment')}
          >
            <ChargesDiscountPanel />
          </AccordionSection>

          <AccordionSection
            sectionId="payment"
            title="Payment"
            isOpen={openSections.payment}
            onToggle={() => toggleSection('payment')}
          >
            <PaymentDetailsForm />
          </AccordionSection>
        </div>

        {isPreviewVisible ? (
          <aside className="responsive-preview preview-scroll">
            <div className="responsive-preview-panel rounded-3xl border border-[#e5e5ea] bg-[#f7f7f9] p-3 shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
              <InvoicePreview ref={previewRef} />
            </div>
          </aside>
        ) : null}
      </div>

      {isLayoutDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6">
          <div className="flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#d2d2d7] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
            <header className="flex items-center justify-between border-b border-[#e5e5ea] px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-[#1d1d1f]">Print Layout Settings</h2>
                <p className="text-xs text-[#6e6e73]">Adjust settings and save to apply in preview, print and PDF export.</p>
              </div>
              <button
                type="button"
                onClick={closeLayoutDialog}
                className="rounded-full border border-[#d2d2d7] bg-white px-3 py-1 text-sm font-medium text-[#3a3a3c] transition hover:border-[#a1a1a6]"
                aria-label="Close print layout settings"
              >
                Close
              </button>
            </header>

            <div className="overflow-y-auto p-4 sm:p-5">
              <LayoutSettingsPanel
                layout={draftLayoutSettings}
                onLayoutChange={(partial) => {
                  setDraftLayoutSettings((prev) => ({ ...prev, ...partial }));
                }}
                showComplianceNote={false}
              />
            </div>

            <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-[#e5e5ea] px-4 py-4 sm:px-5">
              <button
                type="button"
                onClick={resetLayoutDraft}
                className="rounded-lg border border-[#d2d2d7] bg-white px-3 py-2 text-xs font-semibold text-[#3a3a3c] transition hover:border-[#a1a1a6]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={closeLayoutDialog}
                className="rounded-lg border border-[#d2d2d7] bg-white px-3 py-2 text-xs font-semibold text-[#3a3a3c] transition hover:border-[#a1a1a6]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={saveLayoutDraft}
                className="rounded-lg bg-[#0071e3] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#0065cc]"
              >
                Save
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </>
  );
};
