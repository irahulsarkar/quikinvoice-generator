import { zodResolver } from '@hookform/resolvers/zod';
import type { ChangeEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { invoiceSelectors, useInvoiceStore } from '../../store/useInvoiceStore';
import { paymentDetailsSchema, type PaymentDetailsFormValues } from '../../validation/schemas';
import { FormField } from '../common/FormField';
import { QrGenerator } from '../common/QrGenerator';
import { SectionCard } from '../common/SectionCard';
import { Toggle } from '../common/Toggle';
import { inputClassName, textAreaClassName } from './formStyles';

export const PaymentDetailsForm = () => {
  const payment = useInvoiceStore(invoiceSelectors.paymentDetails);
  const seller = useInvoiceStore(invoiceSelectors.seller);
  const totals = useInvoiceStore(invoiceSelectors.totals);
  const { updatePaymentDetails } = useInvoiceStore(invoiceSelectors.actions);

  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm<PaymentDetailsFormValues>({
    resolver: zodResolver(paymentDetailsSchema),
    mode: 'onChange',
    values: payment,
  });

  const showBankDetails = useWatch({ control, name: 'showBankDetails' });
  const showUpiQr = useWatch({ control, name: 'showUpiQr' });

  const bind = <K extends keyof PaymentDetailsFormValues>(name: K) => {
    const registration = register(name);
    return {
      ...registration,
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        registration.onChange(event);
        updatePaymentDetails({ [name]: event.target.value } as Partial<PaymentDetailsFormValues>);
      },
    };
  };

  return (
    <SectionCard title="7) Bank / Payment Details" subtitle="Optional bank details and UPI QR">
      <div className="form-grid-2">
        <Toggle
          label="Show bank details"
          checked={showBankDetails}
          onChange={(checked) => {
            setValue('showBankDetails', checked);
            updatePaymentDetails({ showBankDetails: checked });
          }}
        />
        <Toggle
          label="Show UPI QR"
          checked={showUpiQr}
          onChange={(checked) => {
            setValue('showUpiQr', checked);
            updatePaymentDetails({ showUpiQr: checked });
          }}
        />
      </div>

      <div className="form-grid-2">
        <FormField label="Account name" error={errors.bankAccountName?.message}>
          <input {...bind('bankAccountName')} className={inputClassName} />
        </FormField>
        <FormField label="Bank name" error={errors.bankName?.message}>
          <input {...bind('bankName')} className={inputClassName} />
        </FormField>
        <FormField label="Account number" error={errors.accountNumber?.message}>
          <input {...bind('accountNumber')} className={inputClassName} />
        </FormField>
        <FormField label="IFSC" error={errors.ifsc?.message}>
          <input
            {...bind('ifsc')}
            className={inputClassName}
            onChange={(event) => {
              const value = event.target.value.toUpperCase();
              setValue('ifsc', value, { shouldValidate: true });
              updatePaymentDetails({ ifsc: value });
            }}
          />
        </FormField>
        <FormField label="Branch" error={errors.branch?.message}>
          <input {...bind('branch')} className={inputClassName} />
        </FormField>
        <FormField label="UPI ID" error={errors.upiId?.message}>
          <input {...bind('upiId')} className={inputClassName} />
        </FormField>
      </div>

      <FormField label="Payment terms" error={errors.paymentTerms?.message}>
        <textarea {...bind('paymentTerms')} className={textAreaClassName} />
      </FormField>

      <QrGenerator
        enabled={showUpiQr}
        upiId={payment.upiId}
        payeeName={seller.tradeName}
        amount={totals.grandTotal}
      />
    </SectionCard>
  );
};
