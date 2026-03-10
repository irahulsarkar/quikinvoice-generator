import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useRef, type ChangeEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { getStateByGstCode } from '../../constants/indianStates';
import { invoiceSelectors, useInvoiceStore } from '../../store/useInvoiceStore';
import { findStateMismatchWarning } from '../../utils/gst';
import { deriveStateFromGstin } from '../../utils/validators';
import { sellerDetailsSchema, type SellerDetailsFormValues } from '../../validation/schemas';
import { FormField } from '../common/FormField';
import { LogoUploader } from '../common/LogoUploader';
import { SectionCard } from '../common/SectionCard';
import { StateSelect } from '../common/StateSelect';
import { Toggle } from '../common/Toggle';
import { DownloadIcon, SaveIcon, UploadIcon } from '../common/ActionIcons';
import { inputClassName } from './formStyles';

const SELLER_DETAILS_STORAGE_KEY = 'gst-invoice-seller-details:v1';
const actionButtonClassName = 'rounded-lg border border-[#d2d2d7] bg-white px-2.5 py-1 text-xs font-medium text-[#3a3a3c] transition hover:border-[#a1a1a6]';

const exportSellerDetails = (payload: SellerDetailsFormValues) => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `seller-details-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
};

const normalizeSellerPayload = (payload: SellerDetailsFormValues): SellerDetailsFormValues => ({
  tradeName: payload.tradeName,
  legalName: payload.legalName ?? '',
  addressLine1: payload.addressLine1,
  addressLine2: payload.addressLine2 ?? '',
  city: payload.city,
  stateCode: payload.stateCode,
  pinCode: payload.pinCode,
  phone: payload.phone,
  email: payload.email ?? '',
  pan: payload.pan ?? '',
  gstin: payload.gstin ?? '',
  isUnregistered: payload.isUnregistered,
  jurisdiction: payload.jurisdiction ?? '',
  logoDataUrl: payload.logoDataUrl ?? '',
  signatureDataUrl: payload.signatureDataUrl ?? '',
});

export const SellerDetailsForm = () => {
  const seller = useInvoiceStore(invoiceSelectors.seller);
  const { updateSeller } = useInvoiceStore(invoiceSelectors.actions);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textIconClass = 'inline-flex items-center gap-1.5';

  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm<SellerDetailsFormValues>({
    resolver: zodResolver(sellerDetailsSchema),
    mode: 'onChange',
    values: seller,
  });

  const gstin = useWatch({ control, name: 'gstin' });
  const selectedStateCode = useWatch({ control, name: 'stateCode' });
  const isSellerUnregistered = useWatch({ control, name: 'isUnregistered' });
  const derivedState = useMemo(() => deriveStateFromGstin(gstin || ''), [gstin]);
  const mismatchWarning = findStateMismatchWarning(selectedStateCode, gstin);

  const bind = <K extends keyof SellerDetailsFormValues>(name: K) => {
    const registration = register(name);
    return {
      ...registration,
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        registration.onChange(event);
        updateSeller({ [name]: event.target.value } as Partial<SellerDetailsFormValues>);
      },
    };
  };

  return (
    <SectionCard
      title="1) Company / Seller Details"
      subtitle="Supplier details with PAN, GSTIN and logo"
      actions={(
        <div className="section-actions-row flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              try {
                localStorage.setItem(SELLER_DETAILS_STORAGE_KEY, JSON.stringify(normalizeSellerPayload(seller)));
                window.alert('Seller details saved in this browser.');
              } catch {
                window.alert('Could not save seller details in this browser.');
              }
            }}
            className={actionButtonClassName}
          >
            <span className={textIconClass}>
              <SaveIcon className="h-3.5 w-3.5" />
              Save details
            </span>
          </button>
          <button
            type="button"
            onClick={() => exportSellerDetails(normalizeSellerPayload(seller))}
            className={actionButtonClassName}
          >
            <span className={textIconClass}>
              <DownloadIcon className="h-3.5 w-3.5" />
              Export JSON
            </span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={actionButtonClassName}
          >
            <span className={textIconClass}>
              <UploadIcon className="h-3.5 w-3.5" />
              Import JSON
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="application/json"
            onChange={async (event) => {
              const input = event.currentTarget;
              const file = input.files?.[0];
              if (!file) {
                return;
              }

              try {
                const raw = JSON.parse(await file.text()) as unknown;
                const source = typeof raw === 'object' && raw !== null && 'seller' in raw
                  ? (raw as { seller?: unknown }).seller
                  : raw;
                const parsed = sellerDetailsSchema.safeParse(source);
                if (!parsed.success) {
                  window.alert(parsed.error.issues[0]?.message ?? 'Seller details JSON is invalid.');
                  return;
                }
                updateSeller(normalizeSellerPayload(parsed.data));
              } catch {
                window.alert('Could not import seller details JSON.');
              } finally {
                input.value = '';
              }
            }}
          />
        </div>
      )}
    >
      <Toggle
        label="Unregistered seller"
        checked={isSellerUnregistered}
        onChange={(checked) => {
          setValue('isUnregistered', checked, { shouldValidate: true });
          if (checked) {
            setValue('pan', '', { shouldValidate: true });
            setValue('gstin', '', { shouldValidate: true });
            updateSeller({ isUnregistered: true, pan: '', gstin: '' });
            return;
          }
          updateSeller({ isUnregistered: false });
        }}
        description="Turn on if supplier does not have GSTIN/PAN for this draft"
      />

      <div className="form-grid-2">
        <FormField label="Company / Trade Name" required error={errors.tradeName?.message}>
          <input {...bind('tradeName')} className={inputClassName} />
        </FormField>

        <FormField label="Legal Name" error={errors.legalName?.message}>
          <input {...bind('legalName')} className={inputClassName} />
        </FormField>

        <FormField label="Address line 1" required error={errors.addressLine1?.message}>
          <input {...bind('addressLine1')} className={inputClassName} />
        </FormField>

        <FormField label="Address line 2" error={errors.addressLine2?.message}>
          <input {...bind('addressLine2')} className={inputClassName} />
        </FormField>

        <FormField label="City / District" required error={errors.city?.message}>
          <input {...bind('city')} className={inputClassName} />
        </FormField>

        <FormField label="State / UT" required error={errors.stateCode?.message}>
          <StateSelect
            value={selectedStateCode}
            onChange={(value) => {
              setValue('stateCode', value, { shouldValidate: true });
              updateSeller({ stateCode: value });
            }}
          />
        </FormField>

        <FormField label="State code" hint={getStateByGstCode(selectedStateCode)?.name}>
          <input value={selectedStateCode} readOnly className={`${inputClassName} bg-[#f5f5f7] text-[#3a3a3c]`} />
        </FormField>

        <FormField label="PIN code" required error={errors.pinCode?.message}>
          <input {...bind('pinCode')} className={inputClassName} />
        </FormField>

        <FormField label="Phone number" required error={errors.phone?.message}>
          <input {...bind('phone')} className={inputClassName} />
        </FormField>

        <FormField label="Email" error={errors.email?.message}>
          <input {...bind('email')} className={inputClassName} />
        </FormField>

        <FormField label="PAN" required={!isSellerUnregistered} error={errors.pan?.message}>
          <input
            {...bind('pan')}
            disabled={isSellerUnregistered}
            className={`${inputClassName} ${isSellerUnregistered ? 'cursor-not-allowed bg-[#f5f5f7] text-[#8e8e93]' : ''}`}
            onChange={(event) => {
              const value = event.target.value.toUpperCase();
              setValue('pan', value, { shouldValidate: true });
              updateSeller({ pan: value });
            }}
          />
        </FormField>

        <FormField label="GSTIN" required={!isSellerUnregistered} error={errors.gstin?.message}>
          <input
            {...bind('gstin')}
            disabled={isSellerUnregistered}
            className={`${inputClassName} ${isSellerUnregistered ? 'cursor-not-allowed bg-[#f5f5f7] text-[#8e8e93]' : ''}`}
            onChange={(event) => {
              const value = event.target.value.toUpperCase();
              setValue('gstin', value, { shouldValidate: true });
              updateSeller({ gstin: value });
            }}
          />
        </FormField>

        <FormField label="Jurisdiction" error={errors.jurisdiction?.message}>
          <input {...bind('jurisdiction')} className={inputClassName} />
        </FormField>
      </div>

      {derivedState && !isSellerUnregistered ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
          GSTIN-derived state: {derivedState.gstCode} - {derivedState.name}
          {derivedState.gstCode !== selectedStateCode ? (
            <button
              type="button"
              onClick={() => {
                setValue('stateCode', derivedState.gstCode, { shouldValidate: true });
                updateSeller({ stateCode: derivedState.gstCode });
              }}
              className="ml-2 rounded border border-blue-300 px-2 py-0.5 text-[11px] font-medium hover:border-blue-400"
            >
              Match selected state
            </button>
          ) : null}
        </div>
      ) : null}

      {mismatchWarning ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {mismatchWarning}
        </div>
      ) : null}

      <div className="form-grid-2">
        <LogoUploader
          label="Seller logo"
          value={seller.logoDataUrl}
          onChange={(value) => updateSeller({ logoDataUrl: value || '' })}
        />
        <LogoUploader
          label="Signature image (optional)"
          value={seller.signatureDataUrl}
          onChange={(value) => updateSeller({ signatureDataUrl: value || '' })}
        />
      </div>
    </SectionCard>
  );
};
