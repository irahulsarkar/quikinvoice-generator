import { useEffect, useMemo, useRef, useState } from 'react';
import { InvoiceBuilderLayout } from './InvoiceBuilderLayout';
import { invoiceSelectors, useInvoiceStore } from '../../store/useInvoiceStore';
import { clearDraftStorage, loadDraftFromStorage, saveDraftToStorage } from '../../utils/storage';
import { useDebouncedEffect } from '../../hooks/useDebouncedEffect';
import { getBlockingValidationIssues } from '../../utils/invoiceValidation';
import type { InvoiceDraft } from '../../types/invoice';
import { EraserIcon, MenuIcon, SparkIcon, XIcon } from '../common/ActionIcons';
import { AppFooter } from '../common/AppFooter';
import { LandingPage } from './LandingPage';

const isLikelyMobileViewport = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const isNarrowScreen = window.matchMedia('(max-width: 1024px)').matches;
  const ua = navigator.userAgent || '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 1;

  return isNarrowScreen || (isMobileUA && hasTouch);
};

export const AppShell = () => {
  const previewRef = useRef<HTMLDivElement | null>(null);
  const textIconClass = 'inline-flex items-center gap-1.5';
  const [showLanding, setShowLanding] = useState(true);
  const [isNavOpen, setNavOpen] = useState(false);
  const [isMobileBlocked, setIsMobileBlocked] = useState(() => isLikelyMobileViewport());
  const [mobileOverride, setMobileOverride] = useState(false);

  const seller = useInvoiceStore(invoiceSelectors.seller);
  const buyer = useInvoiceStore(invoiceSelectors.buyer);
  const invoiceMeta = useInvoiceStore(invoiceSelectors.invoiceMeta);
  const lineItems = useInvoiceStore(invoiceSelectors.lineItems);
  const chargesDiscount = useInvoiceStore(invoiceSelectors.chargesDiscount);
  const paymentDetails = useInvoiceStore(invoiceSelectors.paymentDetails);
  const layoutSettings = useInvoiceStore(invoiceSelectors.layoutSettings);
  const hydrated = useInvoiceStore((state) => state.hydrated);

  const {
    resetInvoice,
    loadDemoData,
    setDraft,
    setHydrated,
    updateLayoutSettings,
  } = useInvoiceStore(invoiceSelectors.actions);

  const draft: InvoiceDraft = useMemo(() => ({
    seller,
    buyer,
    invoiceMeta,
    lineItems,
    chargesDiscount,
    paymentDetails,
    layoutSettings,
  }), [seller, buyer, invoiceMeta, lineItems, chargesDiscount, paymentDetails, layoutSettings]);

  const blockingIssues = useMemo(() => getBlockingValidationIssues(draft), [draft]);

  useEffect(() => {
    if (hydrated) {
      return;
    }

    const stored = loadDraftFromStorage();
    if (stored) {
      setDraft(stored);
    }
    setHydrated(true);
  }, [hydrated, setDraft, setHydrated]);

  useDebouncedEffect(() => {
    if (!hydrated) {
      return;
    }
    saveDraftToStorage(draft, layoutSettings.storageMode);
  }, [draft, hydrated, layoutSettings.storageMode], 350);

  useEffect(() => {
    if (layoutSettings.darkMode) {
      updateLayoutSettings({ darkMode: false });
    }
    document.documentElement.classList.remove('dark');
  }, [layoutSettings.darkMode, updateLayoutSettings]);

  useEffect(() => {
    const handleViewportChange = () => setIsMobileBlocked(isLikelyMobileViewport());

    handleViewportChange();
    window.addEventListener('resize', handleViewportChange);
    return () => window.removeEventListener('resize', handleViewportChange);
  }, []);

  if (showLanding) {
    return (
      <div className="app-canvas h-[100dvh] overflow-hidden text-[#1d1d1f]">
        <LandingPage onGetStarted={() => setShowLanding(false)} />
        <div className="pointer-events-none fixed inset-x-0 bottom-3 z-30 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1320px] pointer-events-auto">
            <AppFooter className="mt-0" />
          </div>
        </div>
      </div>
    );
  }

  if (isMobileBlocked && !mobileOverride) {
    return (
      <div className="mobile-blocker">
        <div className="mobile-blocker__card">
          <h1>QuikInvoice works best on a wider screen</h1>
          <p className="mobile-blocker__body">
            The invoice builder is designed for laptops and desktops. Please reopen this link on a desktop browser for the full experience.
          </p>
          <p className="mobile-blocker__hint">
            Tip: email or copy the link to yourself and open it on your computer.
          </p>
          <div className="mobile-blocker__actions">
            <button
              type="button"
              className="mobile-blocker__primary"
              onClick={() => setMobileOverride(true)}
            >
              Continue on this device
            </button>
            <button
              type="button"
              className="mobile-blocker__ghost"
              onClick={() => window.open(window.location.href, '_blank')}
            >
              Open in new tab
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-canvas min-h-screen text-[#1d1d1f]">
      <div className="responsive-shell responsive-shell--wide responsive-page-frame">
        <header className="responsive-navbar rounded-3xl border border-[#e5e5ea] bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="responsive-navbar-top">
            <div>
              <p className="responsive-eyebrow font-semibold uppercase text-[#6e6e73]">QuikInvoice</p>
              <h1 className="responsive-main-title mt-1 font-semibold tracking-tight">GST Invoice Generator</h1>
            </div>
            <button
              type="button"
              onClick={() => setNavOpen((value) => !value)}
              className="responsive-navbar-toggle rounded-full border border-[#d2d2d7] bg-white px-3 py-2 text-xs font-semibold text-[#3a3a3c] transition hover:border-[#a1a1a6]"
              aria-expanded={isNavOpen}
              aria-controls="builder-nav-menu"
              aria-label={isNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isNavOpen ? <XIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
              {isNavOpen ? 'Close' : 'Menu'}
            </button>
          </div>

          <nav id="builder-nav-menu" className={`responsive-navbar-menu ${isNavOpen ? 'is-open' : ''}`}>
            <button
              type="button"
              onClick={() => {
                loadDemoData();
                setNavOpen(false);
              }}
              className="rounded-lg border border-[#d2d2d7] bg-white px-3 py-2 text-xs font-semibold text-[#1d1d1f] transition hover:border-[#a1a1a6]"
            >
              <span className={textIconClass}>
                <SparkIcon className="h-3.5 w-3.5" />
                Load sample data
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!window.confirm('Reset entire invoice draft?')) {
                  return;
                }
                resetInvoice();
                clearDraftStorage();
                setNavOpen(false);
              }}
              className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 transition hover:border-rose-300"
            >
              <span className={textIconClass}>
                <EraserIcon className="h-3.5 w-3.5" />
                Reset invoice
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLanding(true);
                setNavOpen(false);
              }}
              className="rounded-lg border border-[#d2d2d7] bg-white px-3 py-2 text-xs font-semibold text-[#3a3a3c] transition hover:border-[#a1a1a6]"
            >
              <span className={textIconClass}>
                <XIcon className="h-3.5 w-3.5" />
                Close generator
              </span>
            </button>
          </nav>
        </header>

        <InvoiceBuilderLayout
          previewRef={previewRef}
          canExport={blockingIssues.length === 0}
          draft={draft}
          onImportDraft={(incoming) => setDraft(incoming)}
        />
        <AppFooter />
      </div>
    </div>
  );
};
