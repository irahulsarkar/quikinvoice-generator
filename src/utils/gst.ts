import { getStateByGstCode } from '../constants/indianStates';
import type { BuyerDetails, SellerDetails, TaxMode } from '../types/invoice';
import { getGstinStateCode, isValidGstin } from './validators';

export const getStateCodeFromRecord = (stateCode: string) => stateCode;

export const determineTaxMode = (seller: SellerDetails, buyer: BuyerDetails): TaxMode => {
  const sellerCode = seller.stateCode;
  const posCode = buyer.placeOfSupplyCode || buyer.stateCode;

  if (posCode === '96') {
    return 'export';
  }

  if (!sellerCode || !posCode) {
    return 'intra';
  }

  return sellerCode === posCode ? 'intra' : 'inter';
};

export const findStateMismatchWarning = (selectedStateCode: string, gstin?: string) => {
  if (!gstin || !isValidGstin(gstin)) {
    return '';
  }
  const gstStateCode = getGstinStateCode(gstin);
  if (gstStateCode !== selectedStateCode) {
    const gstState = getStateByGstCode(gstStateCode);
    return `GSTIN suggests ${gstState?.name ?? gstStateCode}, but selected state differs.`;
  }
  return '';
};
