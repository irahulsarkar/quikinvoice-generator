const PAGE_DIMENSIONS = {
  A4: { portrait: [210, 297], landscape: [297, 210] },
  Letter: { portrait: [216, 279], landscape: [279, 216] },
} as const;

interface ExportPdfOptions {
  container: HTMLElement;
  fileName: string;
  pageSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
}

interface PdfBuildOptions {
  container: HTMLElement;
  pageSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
}

const buildInvoicePdf = async ({
  container,
  pageSize,
  orientation,
}: PdfBuildOptions) => {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const pages = Array.from(container.querySelectorAll<HTMLElement>('.invoice-page'));
  if (!pages.length) {
    throw new Error('No invoice pages found to export.');
  }

  const [widthMm, heightMm] = PAGE_DIMENSIONS[pageSize][orientation];
  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: [widthMm, heightMm],
    compress: true,
  });

  for (let index = 0; index < pages.length; index += 1) {
    const page = pages[index];
    const canvas = await html2canvas(page, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imageData = canvas.toDataURL('image/png');
    if (index > 0) {
      pdf.addPage([widthMm, heightMm], orientation);
    }

    pdf.addImage(imageData, 'PNG', 0, 0, widthMm, heightMm, undefined, 'FAST');
  }

  return pdf;
};

export const exportInvoiceToPdf = async ({
  container,
  fileName,
  pageSize,
  orientation,
}: ExportPdfOptions) => {
  const pdf = await buildInvoicePdf({
    container,
    pageSize,
    orientation,
  });

  pdf.save(fileName);
};

export const generateInvoicePdfBlob = async ({
  container,
  pageSize,
  orientation,
}: PdfBuildOptions): Promise<Blob> => {
  const pdf = await buildInvoicePdf({
    container,
    pageSize,
    orientation,
  });

  return pdf.output('blob');
};
