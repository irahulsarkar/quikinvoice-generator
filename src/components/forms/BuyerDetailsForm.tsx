import { zodResolver } from '@hookform/resolvers/zod';
import type { ChangeEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { getStateByGstCode } from '../../constants/indianStates';
import { invoiceSelectors, useInvoiceStore } from '../../store/useInvoiceStore';
import { determineTaxMode, findStateMismatchWarning } from '../../utils/gst';
import { buyerDetailsSchema, type BuyerDetailsFormValues } from '../../validation/schemas';
import { FormField } from '../common/FormField';
import { SectionCard } from '../common/SectionCard';
import { StateSelect } from '../common/StateSelect';
import { Toggle } from '../common/Toggle';
import { SaveIcon, UndoIcon } from '../common/ActionIcons';
import { inputClassName } from './formStyles';

export const BuyerDetailsForm = () => {
  const buyer = useInvoiceStore(invoiceSelectors.buyer);
  const seller = useInvoiceStore(invoiceSelectors.seller);
  const { updateBuyer, saveCurrentBuyer, restoreSavedBuyer } = useInvoiceStore(invoiceSelectors.actions);

  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm<BuyerDetailsFormValues>({
    resolver: zodResolver(buyerDetailsSchema),
    mode: 'onChange',
    values: buyer,
  });

  const stateCode = useWatch({ control, name: 'stateCode' });
  const gstin = useWatch({ control, name: 'gstin' });
  const placeOfSupply = useWatch({ control, name: 'placeOfSupplyCode' });
  const unregistered = useWatch({ control, name: 'isUnregistered' });
  const mismatchWarning = findStateMismatchWarning(stateCode, gstin);
  const taxMode = determineTaxMode(seller, { ...buyer, placeOfSupplyCode: placeOfSupply });
  const textIconClass = 'inline-flex items-center gap-1.5';

  const bind = <K extends keyof BuyerDetailsFormValues>(name: K) => {
    const registration = register(name);
    return {
      ...registration,
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        registration.onChange(event);
        updateBuyer({ [name]: event.target.value } as Partial<BuyerDetailsFormValues>);
      },
    };
  };

  return (
    <SectionCard
      title="2) Buyer / Client Details"
      subtitle="Recipient details with GST and place of supply"
      actions={(
        <div className="section-actions-row flex flex-wrap gap-2">
          <button
            type="button"
            onClick={saveCurrentBuyer}
            className="rounded-lg border border-[#d2d2d7] bg-white px-2.5 py-1 text-xs font-medium text-[#3a3a3c] transition hover:border-[#a1a1a6]"
          >
            <span className={textIconClass}>
              <SaveIcon className="h-3.5 w-3.5" />
              Save details
            </span>
          </button>
          <button
            type="button"
            onClick={restoreSavedBuyer}
            className="rounded-lg border border-[#d2d2d7] bg-white px-2.5 py-1 text-xs font-medium text-[#3a3a3c] transition hover:border-[#a1a1a6]"
          >
            <span className={textIconClass}>
              <UndoIcon className="h-3.5 w-3.5" />
              Restore saved
            </span>
          </button>
        </div>
      )}
    >
      <Toggle
        label="Unregistered buyer"
        checked={unregistered}
        onChange={(checked) => {
          setValue('isUnregistered', checked, { shouldValidate: true });
          updateBuyer({ isUnregistered: checked, gstin: checked ? '' : buyer.gstin });
        }}
        description="Turn on when buyer has no GSTIN"
      />

      <div className="form-grid-2">
        <FormField label="Buyer name" required error={errors.buyerName?.message}>
          <input {...bind('buyerName')} className={inputClassName} />
        </FormField>

        <FormField label="Company name" error={errors.companyName?.message}>
          <input {...bind('companyName')} className={inputClassName} />
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
            value={stateCode}
            onChange={(value) => {
              setValue('stateCode', value, { shouldValidate: true });
              updateBuyer({ stateCode: value });
            }}
          />
        </FormField>

        <FormField label="State code" hint={getStateByGstCode(stateCode)?.name}>
          <input value={stateCode} readOnly className={`${inputClassName} bg-[#f5f5f7] text-[#3a3a3c]`} />
        </FormField>

        <FormField label="PIN code" required error={errors.pinCode?.message}>
          <input {...bind('pinCode')} className={inputClassName} />
        </FormField>

        <FormField label="Phone" required error={errors.phone?.message}>
          <input {...bind('phone')} className={inputClassName} />
        </FormField>

        <FormField label="Email" error={errors.email?.message}>
          <input {...bind('email')} className={inputClassName} />
        </FormField>

        <FormField label="PAN" error={errors.pan?.message}>
          <input
            {...bind('pan')}
            className={inputClassName}
            onChange={(event) => {
              const value = event.target.value.toUpperCase();
              setValue('pan', value, { shouldValidate: true });
              updateBuyer({ pan: value });
            }}
          />
        </FormField>

        <FormField label="GSTIN" error={errors.gstin?.message} hint="Optional for unregistered buyers">
          <input
            {...bind('gstin')}
            disabled={unregistered}
            className={`${inputClassName} ${unregistered ? 'cursor-not-allowed opacity-60' : ''}`}
            onChange={(event) => {
              const value = event.target.value.toUpperCase();
              setValue('gstin', value, { shouldValidate: true });
              updateBuyer({ gstin: value });
            }}
          />
        </FormField>

        <FormField label="Place of Supply" required error={errors.placeOfSupplyCode?.message}>
          <StateSelect
            value={placeOfSupply}
            onChange={(value) => {
              setValue('placeOfSupplyCode', value, { shouldValidate: true });
              updateBuyer({ placeOfSupplyCode: value });
            }}
          />
        </FormField>
      </div>

      {mismatchWarning ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {mismatchWarning}
        </div>
      ) : null}

      <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
        Tax regime preview: {taxMode === 'intra' ? 'Intra-state (CGST + SGST)' : taxMode === 'inter' ? 'Inter-state (IGST)' : 'Export / foreign'}
      </div>
    </SectionCard>
  );
};
