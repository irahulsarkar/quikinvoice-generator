import { zodResolver } from '@hookform/resolvers/zod';
import type { ChangeEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { invoiceSelectors, useInvoiceStore } from '../../store/useInvoiceStore';
import { invoiceMetaSchema, type InvoiceMetaFormValues } from '../../validation/schemas';
import { FormField } from '../common/FormField';
import { SectionCard } from '../common/SectionCard';
import { Toggle } from '../common/Toggle';
import { inputClassName, textAreaClassName } from './formStyles';

const supplyTypes: Array<{ label: string; value: 'goods' | 'services' | 'mixed' }> = [
  { label: 'Goods', value: 'goods' },
  { label: 'Services', value: 'services' },
  { label: 'Mixed', value: 'mixed' },
];

export const InvoiceMetaForm = () => {
  const invoiceMeta = useInvoiceStore(invoiceSelectors.invoiceMeta);
  const { updateInvoiceMeta } = useInvoiceStore(invoiceSelectors.actions);

  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm<InvoiceMetaFormValues>({
    resolver: zodResolver(invoiceMetaSchema),
    mode: 'onChange',
    values: invoiceMeta,
  });

  const reverseCharge = useWatch({ control, name: 'reverseCharge' });
  const supplyType = useWatch({ control, name: 'supplyType' });

  const bind = <K extends keyof InvoiceMetaFormValues>(name: K) => {
    const registration = register(name);
    return {
      ...registration,
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        registration.onChange(event);
        updateInvoiceMeta({ [name]: event.target.value } as Partial<InvoiceMetaFormValues>);
      },
    };
  };

  return (
    <SectionCard title="3) Invoice Meta" subtitle="Invoice identity and transaction metadata">
      <div className="form-grid-2">
        <FormField label="Invoice number" required error={errors.invoiceNumber?.message}>
          <input {...bind('invoiceNumber')} className={inputClassName} />
        </FormField>

        <FormField label="Invoice date" required error={errors.invoiceDate?.message}>
          <input type="date" {...bind('invoiceDate')} className={inputClassName} />
        </FormField>

        <FormField label="Due date" error={errors.dueDate?.message}>
          <input type="date" {...bind('dueDate')} className={inputClassName} />
        </FormField>

        <FormField label="Currency">
          <input value="INR" readOnly className={`${inputClassName} bg-[#f5f5f7] text-[#3a3a3c]`} />
        </FormField>

        <FormField label="Supply type">
          <div className="r-grid r-grid-3 gap-2">
            {supplyTypes.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setValue('supplyType', option.value, { shouldValidate: true });
                  updateInvoiceMeta({ supplyType: option.value });
                }}
                className={`rounded-lg border px-2 py-2 text-xs font-medium ${supplyType === option.value
                  ? 'border-[#a7d4ff] bg-[#eaf4ff] text-[#004b8d]'
                  : 'border-[#d2d2d7] text-[#6e6e73]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="Reverse charge">
          <Toggle
            label="Reverse charge"
            checked={reverseCharge}
            onChange={(checked) => {
              setValue('reverseCharge', checked, { shouldValidate: true });
              updateInvoiceMeta({ reverseCharge: checked });
            }}
          />
        </FormField>

        <FormField label="PO number" error={errors.poNumber?.message}>
          <input {...bind('poNumber')} className={inputClassName} />
        </FormField>

        <FormField label="E-way bill" error={errors.eWayBill?.message}>
          <input {...bind('eWayBill')} className={inputClassName} />
        </FormField>

        <FormField label="Delivery note" error={errors.deliveryNote?.message}>
          <input {...bind('deliveryNote')} className={inputClassName} />
        </FormField>

        <FormField label="Reference" error={errors.reference?.message}>
          <input {...bind('reference')} className={inputClassName} />
        </FormField>
      </div>

      <div className="form-grid-2">
        <FormField label="Notes" error={errors.notes?.message}>
          <textarea {...bind('notes')} className={textAreaClassName} />
        </FormField>

        <FormField label="Terms" error={errors.terms?.message}>
          <textarea {...bind('terms')} className={textAreaClassName} />
        </FormField>
      </div>
    </SectionCard>
  );
};
