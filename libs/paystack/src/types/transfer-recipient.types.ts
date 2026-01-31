export interface Bank {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string | null;
  pay_with_bank: boolean;
  active: boolean;
  is_deleted: boolean;
  country: string;
  currency: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransferRecipientDetails {
  authorization_code: string | null;
  account_number: string;
  account_name: string | null;
  bank_code: string;
  bank_name: string;
}

export interface TransferRecipient {
  active: boolean;
  createdAt: string;
  currency: string;
  domain: string;
  id: number;
  integration: number;
  name: string;
  recipient_code: string;
  type: string;
  updatedAt: string;
  is_deleted: boolean;
  details: TransferRecipientDetails;
}

export interface PaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export type CreateTransferRecipientResponse =
  PaystackResponse<TransferRecipient>;