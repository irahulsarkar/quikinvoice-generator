import { getStateByGstCode } from '../constants/indianStates';

export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z][Z][0-9A-Z]$/;
export const MOBILE_REGEX = /^(?:\+91[-\s]?)?[6-9]\d{9}$/;
export const LANDLINE_REGEX = /^(?:0[1-9]\d{1,4}[-\s]?)?[1-9]\d{5,7}$/;
export const PIN_REGEX = /^[1-9][0-9]{5}$/;
export const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
export const UPI_REGEX = /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/;

export const normalizeUpper = (value: string) => value.trim().toUpperCase();

export const isValidPan = (pan: string) => PAN_REGEX.test(normalizeUpper(pan));

export const getGstinPanPart = (gstin: string) => normalizeUpper(gstin).slice(2, 12);

export const getGstinStateCode = (gstin: string) => normalizeUpper(gstin).slice(0, 2);

export const isValidGstin = (gstin: string) => GSTIN_REGEX.test(normalizeUpper(gstin));

export const isPanConsistentWithGstin = (pan: string, gstin: string) => {
  if (!pan || !gstin) {
    return true;
  }
  if (!isValidPan(pan) || !isValidGstin(gstin)) {
    return false;
  }
  return normalizeUpper(pan) === getGstinPanPart(gstin);
};

export const isPhoneValid = (phone: string) => {
  const cleaned = phone.replace(/\s+/g, '');
  return MOBILE_REGEX.test(cleaned) || LANDLINE_REGEX.test(cleaned);
};

export const isPinValid = (pin: string) => PIN_REGEX.test(pin.trim());

export const isIfscValid = (ifsc: string) => IFSC_REGEX.test(normalizeUpper(ifsc));

export const isUpiValid = (upi: string) => UPI_REGEX.test(upi.trim());

export const deriveStateFromGstin = (gstin: string) => {
  if (!isValidGstin(gstin)) {
    return undefined;
  }
  return getStateByGstCode(getGstinStateCode(gstin));
};
