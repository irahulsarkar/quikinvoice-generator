import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QrGeneratorProps {
  upiId?: string;
  payeeName?: string;
  amount?: number;
  enabled: boolean;
}

const buildUpiLink = ({ upiId, payeeName, amount }: { upiId: string; payeeName?: string; amount?: number }) => {
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName || 'Invoice Payment',
    cu: 'INR',
  });

  if (amount && amount > 0) {
    params.set('am', amount.toFixed(2));
  }

  return `upi://pay?${params.toString()}`;
};

export const QrGenerator = ({ upiId, payeeName, amount, enabled }: QrGeneratorProps) => {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (!enabled || !upiId) {
      return;
    }

    const payload = buildUpiLink({ upiId, payeeName, amount });
    QRCode.toDataURL(payload, {
      margin: 1,
      width: 160,
    })
      .then((data: string) => setQrDataUrl(data))
      .catch(() => setQrDataUrl(''));
  }, [amount, enabled, payeeName, upiId]);

  if (!enabled || !upiId) {
    return <p className="text-xs text-[#8e8e93]">Enable UPI QR and enter a valid UPI ID to preview.</p>;
  }

  if (!qrDataUrl) {
    return <p className="text-xs text-[#8e8e93]">Generating QR...</p>;
  }

  return (
    <div className="inline-flex flex-col items-center rounded-xl border border-[#d2d2d7] bg-white p-3">
      <img src={qrDataUrl} alt="UPI QR" className="h-32 w-32 rounded-md" />
      <p className="mt-2 text-[11px] text-[#8e8e93]">Scan to pay via UPI</p>
    </div>
  );
};
