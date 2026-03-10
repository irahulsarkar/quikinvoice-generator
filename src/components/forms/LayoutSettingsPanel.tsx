import type { LayoutSettings } from '../../types/invoice';
import { SectionCard } from '../common/SectionCard';
import { Toggle } from '../common/Toggle';

type VisibilityToggleKey =
  | 'showSellerLogo'
  | 'showBuyerGSTIN'
  | 'showBuyerPAN'
  | 'showHSN'
  | 'showTaxRate'
  | 'showLineDiscount'
  | 'showBankDetails'
  | 'showUpiQr'
  | 'showNotes'
  | 'showJurisdiction'
  | 'showSignatureBlock'
  | 'showTaxSummary'
  | 'showHsnSummary'
  | 'showPageNumbers'
  | 'showAuthorizedSignatory'
  | 'showAmountInWords';

const displayToggles: Array<{ key: VisibilityToggleKey; label: string }> = [
  { key: 'showSellerLogo', label: 'Seller logo' },
  { key: 'showBuyerGSTIN', label: 'Buyer GSTIN' },
  { key: 'showBuyerPAN', label: 'Buyer PAN' },
  { key: 'showHSN', label: 'HSN/SAC column' },
  { key: 'showTaxRate', label: 'Tax rate column' },
  { key: 'showLineDiscount', label: 'Line discount column' },
  { key: 'showBankDetails', label: 'Bank details' },
  { key: 'showUpiQr', label: 'UPI QR' },
  { key: 'showNotes', label: 'Notes / terms' },
  { key: 'showJurisdiction', label: 'Jurisdiction' },
  { key: 'showSignatureBlock', label: 'Signature block' },
  { key: 'showTaxSummary', label: 'Tax summary table' },
  { key: 'showHsnSummary', label: 'HSN-wise summary' },
  { key: 'showPageNumbers', label: 'Page numbers' },
  { key: 'showAuthorizedSignatory', label: 'Authorised Signatory text' },
  { key: 'showAmountInWords', label: 'Amount in words' },
];

interface LayoutSettingsPanelProps {
  layout: LayoutSettings;
  onLayoutChange: (partial: Partial<LayoutSettings>) => void;
  showComplianceNote?: boolean;
}

export const LayoutSettingsPanel = ({
  layout,
  onLayoutChange,
  showComplianceNote = true,
}: LayoutSettingsPanelProps) => {
  return (
    <SectionCard title="Print Layout Settings" subtitle="Page style, visibility controls and rendering preferences">
      <div className="form-grid-4">
        <label className="space-y-1 text-xs text-[#6e6e73]">
          Page size
          <select
            value={layout.pageSize}
            onChange={(event) => onLayoutChange({ pageSize: event.target.value as 'A4' | 'Letter' })}
            className="w-full rounded-md border border-[#d2d2d7] bg-white px-2 py-1"
          >
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
          </select>
        </label>

        <label className="space-y-1 text-xs text-[#6e6e73]">
          Orientation
          <select
            value={layout.orientation}
            onChange={(event) => onLayoutChange({ orientation: event.target.value as 'portrait' | 'landscape' })}
            className="w-full rounded-md border border-[#d2d2d7] bg-white px-2 py-1"
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </label>

        <label className="space-y-1 text-xs text-[#6e6e73]">
          Margin
          <select
            value={layout.marginPreset}
            onChange={(event) => onLayoutChange({ marginPreset: event.target.value as 'small' | 'medium' | 'large' | 'custom' })}
            className="w-full rounded-md border border-[#d2d2d7] bg-white px-2 py-1"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="custom">Custom</option>
          </select>
        </label>

        <label className="space-y-1 text-xs text-[#6e6e73]">
          Custom margin (mm)
          <input
            type="number"
            min={5}
            max={30}
            step={1}
            disabled={layout.marginPreset !== 'custom'}
            value={layout.customMarginMm}
            onChange={(event) => onLayoutChange({ customMarginMm: Number(event.target.value) || 12 })}
            className="w-full rounded-md border border-[#d2d2d7] bg-white px-2 py-1 disabled:opacity-50"
          />
        </label>

        <label className="space-y-1 text-xs text-[#6e6e73]">
          Theme
          <select
            value={layout.invoiceTheme}
            onChange={(event) => onLayoutChange({ invoiceTheme: event.target.value as 'classic' | 'modern' | 'minimal' })}
            className="w-full rounded-md border border-[#d2d2d7] bg-white px-2 py-1"
          >
            <option value="classic">Classic</option>
            <option value="modern">Modern</option>
            <option value="minimal">Minimal</option>
          </select>
        </label>

        <label className="space-y-1 text-xs text-[#6e6e73]">
          Font scale
          <input
            type="range"
            min={0.9}
            max={1.15}
            step={0.01}
            value={layout.fontScale}
            onChange={(event) => onLayoutChange({ fontScale: Number(event.target.value) })}
            className="w-full"
          />
        </label>

        <label className="space-y-1 text-xs text-[#6e6e73]">
          Signature alignment
          <select
            value={layout.signatureAlignment}
            onChange={(event) => onLayoutChange({ signatureAlignment: event.target.value as 'left' | 'center' | 'right' })}
            className="w-full rounded-md border border-[#d2d2d7] bg-white px-2 py-1"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </label>

        <label className="space-y-1 text-xs text-[#6e6e73]">
          Storage mode
          <select
            value={layout.storageMode}
            onChange={(event) => onLayoutChange({ storageMode: event.target.value as 'session' | 'local' })}
            className="w-full rounded-md border border-[#d2d2d7] bg-white px-2 py-1"
          >
            <option value="session">Session (default)</option>
            <option value="local">Local storage</option>
          </select>
        </label>
      </div>

      <div className="form-grid-3 gap-2">
        <Toggle
          label="Auto-fit content"
          checked={layout.autoFit}
          onChange={(checked) => onLayoutChange({ autoFit: checked })}
        />
        <Toggle
          label="Compact mode"
          checked={layout.compactMode}
          onChange={(checked) => onLayoutChange({ compactMode: checked })}
        />
      </div>

      <div className="form-grid-3 gap-2">
        {displayToggles.map((toggle) => (
          <Toggle
            key={toggle.key}
            label={toggle.label}
            checked={layout[toggle.key]}
            onChange={(checked) => onLayoutChange({ [toggle.key]: checked } as Partial<LayoutSettings>)}
          />
        ))}
      </div>

      <label className="block text-xs text-[#6e6e73]">
        Footer text
        <input
          value={layout.footerText}
          onChange={(event) => onLayoutChange({ footerText: event.target.value })}
          className="mt-1 w-full rounded-md border border-[#d2d2d7] bg-white px-2 py-1"
        />
      </label>

      {showComplianceNote ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          GST-ready invoice generator. Verify final commercial/legal usage with your CA or tax professional.
        </div>
      ) : null}
    </SectionCard>
  );
};
