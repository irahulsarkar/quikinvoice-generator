const ONES = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const twoDigitsToWords = (value: number) => {
  if (value < 20) {
    return ONES[value];
  }
  const ten = Math.floor(value / 10);
  const unit = value % 10;
  return `${TENS[ten]}${unit ? ` ${ONES[unit]}` : ''}`;
};

const threeDigitsToWords = (value: number) => {
  const hundred = Math.floor(value / 100);
  const remainder = value % 100;
  if (!hundred) {
    return twoDigitsToWords(remainder);
  }
  if (!remainder) {
    return `${ONES[hundred]} Hundred`;
  }
  return `${ONES[hundred]} Hundred ${twoDigitsToWords(remainder)}`;
};

const integerToIndianWords = (value: number): string => {
  if (value === 0) {
    return ONES[0];
  }

  const parts: string[] = [];

  const crore = Math.floor(value / 10000000);
  if (crore) {
    parts.push(`${integerToIndianWords(crore)} Crore`);
  }

  const lakh = Math.floor((value % 10000000) / 100000);
  if (lakh) {
    parts.push(`${integerToIndianWords(lakh)} Lakh`);
  }

  const thousand = Math.floor((value % 100000) / 1000);
  if (thousand) {
    parts.push(`${integerToIndianWords(thousand)} Thousand`);
  }

  const hundredAndBelow = value % 1000;
  if (hundredAndBelow) {
    parts.push(threeDigitsToWords(hundredAndBelow));
  }

  return parts.join(' ').replace(/\s+/g, ' ').trim();
};

export const formatInr = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
};

export const formatInrNumber = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
};

export const numberToIndianCurrencyWords = (amount: number): string => {
  const safeAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0;
  const whole = Math.floor(safeAmount);
  const paise = Math.round((safeAmount - whole) * 100);

  const rupeesWords = `${integerToIndianWords(whole)} Rupees`;
  if (!paise) {
    return `${rupeesWords} Only`;
  }

  const paiseWords = `${integerToIndianWords(paise)} Paise`;
  return `${rupeesWords} and ${paiseWords} Only`;
};
