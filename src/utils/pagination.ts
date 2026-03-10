import type { LayoutSettings, LineItem, PaginatedInvoice } from '../types/invoice';

const getRowsPerPage = (settings: LayoutSettings) => {
  let rows = settings.pageSize === 'A4' ? 18 : 17;
  if (settings.orientation === 'landscape') {
    rows -= 3;
  }
  if (settings.compactMode) {
    rows += 2;
  }
  return Math.max(8, rows);
};

export const paginateInvoiceContentForPrint = (
  lineItems: LineItem[],
  settings: LayoutSettings,
  reserveRowsForSummary = 6,
): PaginatedInvoice => {
  const rowsPerPage = getRowsPerPage(settings);
  if (!lineItems.length) {
    return { pages: [[]], totalPages: 1 };
  }

  const pages: LineItem[][] = [];
  let index = 0;

  while (index < lineItems.length) {
    const remaining = lineItems.length - index;
    const isLastChunk = remaining <= rowsPerPage;
    const effectiveRows = isLastChunk ? Math.max(4, rowsPerPage - reserveRowsForSummary) : rowsPerPage;
    const count = remaining <= effectiveRows ? remaining : rowsPerPage;

    pages.push(lineItems.slice(index, index + count));
    index += count;
  }

  if (!pages.length) {
    pages.push([]);
  }

  return {
    pages,
    totalPages: pages.length,
  };
};
