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

const buildHiResCanvas = async (
  page: HTMLElement,
  html2canvas: typeof import('html2canvas').default,
  widthMm: number,
  heightMm: number,
) => {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const scale = Math.min(4, Math.max(2.5, dpr * 1.5));
  const bleedMm = 6; // extra margin to avoid right/left clipping in exports

  // Render a clean clone offscreen at fixed physical dimensions so mobile viewport width doesn't shrink the page.
  const sandbox = document.createElement('div');
  sandbox.style.position = 'fixed';
  sandbox.style.left = '-9999px';
  sandbox.style.top = '0';
  sandbox.style.opacity = '0';
  sandbox.style.pointerEvents = 'none';
  sandbox.style.zIndex = '-1';

  // Outer wrapper adds bleed so tables don't clip at the edges
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.style.padding = `${bleedMm}mm`;
  wrapper.style.background = '#ffffff';
  wrapper.style.boxSizing = 'border-box';
  wrapper.style.width = `${widthMm + bleedMm * 2}mm`;
  wrapper.style.minHeight = `${heightMm + bleedMm * 2}mm`;

  const clone = page.cloneNode(true) as HTMLElement;
  clone.style.margin = '0 auto';
  clone.style.width = `${widthMm}mm`;
  clone.style.minHeight = `${heightMm}mm`;
  clone.style.maxWidth = 'none';

  wrapper.appendChild(clone);
  sandbox.appendChild(wrapper);
  document.body.appendChild(sandbox);

  const targetWidth = wrapper.scrollWidth;
  const targetHeight = wrapper.scrollHeight;

  const canvas = await html2canvas(wrapper, {
    scale,
    useCORS: true,
    backgroundColor: '#ffffff',
    width: targetWidth,
    height: targetHeight,
    windowWidth: targetWidth,
    windowHeight: targetHeight,
    logging: false,
  });

  sandbox.remove();
  return canvas;
};

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
    const canvas = await buildHiResCanvas(page, html2canvas, widthMm, heightMm);

    const imageData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imageData);
    const scale = Math.min(widthMm / imgProps.width, heightMm / imgProps.height);
    const renderWidth = imgProps.width * scale;
    const renderHeight = imgProps.height * scale;
    const offsetX = (widthMm - renderWidth) / 2;
    const offsetY = (heightMm - renderHeight) / 2;

    if (index > 0) {
      pdf.addPage([widthMm, heightMm], orientation);
    }

    pdf.addImage(imageData, 'PNG', offsetX, offsetY, renderWidth, renderHeight, undefined, 'MEDIUM');
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
