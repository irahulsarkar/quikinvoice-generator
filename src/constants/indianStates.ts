export interface IndianState {
  name: string;
  code: string;
  gstCode: string;
  type: 'state' | 'ut' | 'foreign';
}

export const INDIAN_STATES_AND_UTS: IndianState[] = [
  { name: 'Jammu and Kashmir', code: 'JK', gstCode: '01', type: 'ut' },
  { name: 'Himachal Pradesh', code: 'HP', gstCode: '02', type: 'state' },
  { name: 'Punjab', code: 'PB', gstCode: '03', type: 'state' },
  { name: 'Chandigarh', code: 'CH', gstCode: '04', type: 'ut' },
  { name: 'Uttarakhand', code: 'UK', gstCode: '05', type: 'state' },
  { name: 'Haryana', code: 'HR', gstCode: '06', type: 'state' },
  { name: 'Delhi', code: 'DL', gstCode: '07', type: 'ut' },
  { name: 'Rajasthan', code: 'RJ', gstCode: '08', type: 'state' },
  { name: 'Uttar Pradesh', code: 'UP', gstCode: '09', type: 'state' },
  { name: 'Bihar', code: 'BR', gstCode: '10', type: 'state' },
  { name: 'Sikkim', code: 'SK', gstCode: '11', type: 'state' },
  { name: 'Arunachal Pradesh', code: 'AR', gstCode: '12', type: 'state' },
  { name: 'Nagaland', code: 'NL', gstCode: '13', type: 'state' },
  { name: 'Manipur', code: 'MN', gstCode: '14', type: 'state' },
  { name: 'Mizoram', code: 'MZ', gstCode: '15', type: 'state' },
  { name: 'Tripura', code: 'TR', gstCode: '16', type: 'state' },
  { name: 'Meghalaya', code: 'ML', gstCode: '17', type: 'state' },
  { name: 'Assam', code: 'AS', gstCode: '18', type: 'state' },
  { name: 'West Bengal', code: 'WB', gstCode: '19', type: 'state' },
  { name: 'Jharkhand', code: 'JH', gstCode: '20', type: 'state' },
  { name: 'Odisha', code: 'OD', gstCode: '21', type: 'state' },
  { name: 'Chhattisgarh', code: 'CG', gstCode: '22', type: 'state' },
  { name: 'Madhya Pradesh', code: 'MP', gstCode: '23', type: 'state' },
  { name: 'Gujarat', code: 'GJ', gstCode: '24', type: 'state' },
  { name: 'Dadra and Nagar Haveli and Daman and Diu', code: 'DN', gstCode: '26', type: 'ut' },
  { name: 'Maharashtra', code: 'MH', gstCode: '27', type: 'state' },
  { name: 'Andhra Pradesh', code: 'AP', gstCode: '28', type: 'state' },
  { name: 'Karnataka', code: 'KA', gstCode: '29', type: 'state' },
  { name: 'Goa', code: 'GA', gstCode: '30', type: 'state' },
  { name: 'Lakshadweep', code: 'LD', gstCode: '31', type: 'ut' },
  { name: 'Kerala', code: 'KL', gstCode: '32', type: 'state' },
  { name: 'Tamil Nadu', code: 'TN', gstCode: '33', type: 'state' },
  { name: 'Puducherry', code: 'PY', gstCode: '34', type: 'ut' },
  { name: 'Andaman and Nicobar Islands', code: 'AN', gstCode: '35', type: 'ut' },
  { name: 'Telangana', code: 'TS', gstCode: '36', type: 'state' },
  { name: 'Andhra Pradesh (Old)', code: 'AD', gstCode: '37', type: 'state' },
  { name: 'Ladakh', code: 'LA', gstCode: '38', type: 'ut' },
  { name: 'Other Territory', code: 'OT', gstCode: '97', type: 'ut' },
  { name: 'Centre Jurisdiction', code: 'CJ', gstCode: '99', type: 'ut' },
  { name: 'Foreign Country', code: 'FC', gstCode: '96', type: 'foreign' },
];

export const STATES_BY_GST_CODE = new Map(INDIAN_STATES_AND_UTS.map((state) => [state.gstCode, state]));
export const STATES_BY_CODE = new Map(INDIAN_STATES_AND_UTS.map((state) => [state.code, state]));

export const getStateByGstCode = (gstCode: string) => STATES_BY_GST_CODE.get(gstCode);
export const getStateByCode = (code: string) => STATES_BY_CODE.get(code);

export const getStateNameByGstCode = (gstCode: string) => {
  return STATES_BY_GST_CODE.get(gstCode)?.name ?? '';
};
