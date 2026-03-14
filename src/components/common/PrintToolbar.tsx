import { useRef } from 'react';
import type { InvoiceDraft } from '../../types/invoice';
import { generateInvoicePdfBlob } from '../../utils/pdf';
import { exportDraftJson, readDraftFile } from '../../utils/storage';
import {
  FileCodeIcon,
  MailIcon,
  PrinterIcon,
  SettingsIcon,
  UploadIcon,
  WhatsappIcon,
} from './ActionIcons';

interface PrintToolbarProps {
  canExport: boolean;
  previewVisible: boolean;
  previewRef: React.RefObject<HTMLDivElement | null>;
  draft: InvoiceDraft;
  onImportDraft: (draft: InvoiceDraft) => void;
  onOpenLayoutSettings: () => void;
  pageSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
}

export const PrintToolbar = ({
  canExport,
  previewVisible,
  previewRef,
  draft,
  onImportDraft,
  onOpenLayoutSettings,
  pageSize,
  orientation,
}: PrintToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textIconClass = 'inline-flex items-center gap-1.5';
  const pdfFileName = `invoice-${draft.invoiceMeta.invoiceNumber || 'draft'}.pdf`;
  const shareDisabled = !canExport || !previewVisible;

  const triggerBlobDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const normalizeWhatsAppPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `91${digits}`;
    }
    if (digits.length === 11 && digits.startsWith('0')) {
      return `91${digits.slice(1)}`;
    }
    if (digits.length === 12 && digits.startsWith('91')) {
      return digits;
    }
    return digits;
  };

  const buildShareText = () => {
    const sellerName = draft.seller.tradeName || 'Seller';
    const buyerName = draft.buyer.buyerName || 'Buyer';
    const invoiceNo = draft.invoiceMeta.invoiceNumber || 'draft';
    return `Invoice ${invoiceNo} from ${sellerName} for ${buyerName}`;
  };

  const buildPdfFile = async () => {
    if (!previewRef.current) {
      throw new Error('Invoice preview not available');
    }

    const blob = await generateInvoicePdfBlob({
      container: previewRef.current,
      pageSize,
      orientation,
    });

    return new File([blob], pdfFileName, { type: 'application/pdf' });
  };

  const canUseFileShare = (file: File) => (
    typeof navigator !== 'undefined'
    && typeof navigator.share === 'function'
    && typeof navigator.canShare === 'function'
    && navigator.canShare({ files: [file] })
  );

  const onPrint = () => {
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => window.print(), 240);
  };

  const onShareWhatsApp = async () => {
    if (!draft.buyer.phone.trim()) {
      window.alert('Add buyer phone number to share on WhatsApp.');
      return;
    }

    const whatsappPhone = normalizeWhatsAppPhone(draft.buyer.phone);
    if (!whatsappPhone || whatsappPhone.length < 10) {
      window.alert('Enter a valid buyer phone number for WhatsApp sharing.');
      return;
    }

    const shareText = buildShareText();

    try {
      const file = await buildPdfFile();

      if (canUseFileShare(file)) {
        await navigator.share({
          title: 'Invoice PDF',
          text: shareText,
          files: [file],
        });
        return;
      }

      triggerBlobDownload(file, pdfFileName);
      const whatsappLink = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
        `${shareText}\n\nInvoice PDF has been downloaded. Please attach it in WhatsApp and send.`,
      )}`;
      window.open(whatsappLink, '_blank', 'noopener,noreferrer');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      window.alert('Could not prepare invoice PDF for WhatsApp sharing.');
    }
  };

  const onShareEmail = async () => {
    const buyerEmail = draft.buyer.email?.trim() || '';
    if (!buyerEmail) {
      window.alert('Add buyer email address to share by email.');
      return;
    }

    const shareText = buildShareText();
    const subject = `Invoice ${draft.invoiceMeta.invoiceNumber || 'draft'}`;
    const body = `${shareText}\n\nPlease find the invoice attached.`;

    try {
      const file = await buildPdfFile();

      if (canUseFileShare(file)) {
        await navigator.share({
          title: subject,
          text: body,
          files: [file],
        });
        return;
      }

      triggerBlobDownload(file, pdfFileName);
      const mailtoLink = `mailto:${buyerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `${body}\n\nThe PDF was downloaded on your device. Please attach and send.`,
      )}`;
      window.location.href = mailtoLink;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      window.alert('Could not prepare invoice PDF for email sharing.');
    }
  };

  const printDisabled = !canExport || !previewVisible;
  const disabledClass = (disabled: boolean) => (disabled ? 'opacity-50 cursor-not-allowed' : '');

  return (
    <div className="toolbar-grid">
      <button
        type="button"
        disabled={printDisabled}
        onClick={onPrint}
        className={`rounded-lg bg-[#0071e3] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0065cc] ${disabledClass(printDisabled)}`}
        title={previewVisible ? undefined : 'Open invoice preview to print'}
      >
        <span className={textIconClass}>
          <PrinterIcon className="h-3.5 w-3.5" />
          Print
        </span>
      </button>
      <button
        type="button"
        onClick={onOpenLayoutSettings}
        className="rounded-lg border border-[#d2d2d7] bg-white px-3 py-2 text-xs font-semibold text-[#3a3a3c] transition hover:border-[#a1a1a6]"
      >
        <span className={textIconClass}>
          <SettingsIcon className="h-3.5 w-3.5" />
          Print settings
        </span>
      </button>
      <button
        type="button"
        disabled={shareDisabled}
        onClick={onShareWhatsApp}
        className={`rounded-lg border border-[#b7e4c7] bg-white px-3 py-2 text-xs font-semibold text-[#17673b] transition hover:border-[#93d7ac] ${disabledClass(shareDisabled)}`}
        title={previewVisible ? undefined : 'Open invoice preview to share PDF'}
      >
        <span className={textIconClass}>
          <WhatsappIcon className="h-3.5 w-3.5" />
          Share WhatsApp
        </span>
      </button>
      <button
        type="button"
        disabled={shareDisabled}
        onClick={onShareEmail}
        className={`rounded-lg border border-[#d2d2d7] bg-white px-3 py-2 text-xs font-semibold text-[#3a3a3c] transition hover:border-[#a1a1a6] ${disabledClass(shareDisabled)}`}
        title={previewVisible ? undefined : 'Open invoice preview to share PDF'}
      >
        <span className={textIconClass}>
          <MailIcon className="h-3.5 w-3.5" />
          Share Email
        </span>
      </button>
      <button
        type="button"
        onClick={() => exportDraftJson(draft)}
        className="rounded-lg border border-[#d2d2d7] bg-white px-3 py-2 text-xs font-semibold text-[#3a3a3c] transition hover:border-[#a1a1a6]"
      >
        <span className={textIconClass}>
          <FileCodeIcon className="h-3.5 w-3.5" />
          Export Draft JSON
        </span>
      </button>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="rounded-lg border border-[#d2d2d7] bg-white px-3 py-2 text-xs font-semibold text-[#3a3a3c] transition hover:border-[#a1a1a6]"
      >
        <span className={textIconClass}>
          <UploadIcon className="h-3.5 w-3.5" />
          Import Draft JSON
        </span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="application/json"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }
          try {
            const parsed = await readDraftFile(file);
            onImportDraft(parsed);
          } catch {
            window.alert('Could not import JSON draft.');
          }
        }}
      />
    </div>
  );
};
