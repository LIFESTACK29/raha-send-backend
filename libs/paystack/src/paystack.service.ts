import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { AssignAccountDto } from './dto/assign-account.dto';
import { CreateTransferRecipientDto } from './dto/create-transfer-recipient.dto';
import {
  CreateTransferRecipientResponse,
  Bank,
} from './types/transfer-recipient.types';

@Injectable()
export class PaystackService {
  private client: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    const paystackSecret = this.configService.get<string>('PAYSTACK_SECRET');

    this.client = axios.create({
      baseURL: 'https://api.paystack.co',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const message =
          error && error.data && error.response.data.message
            ? error.data.message
            : 'An error occurred while processing the request';
        console.log(error.data ?? error.response.data);
        return Promise.reject(new BadRequestException(message));
      },
    );
  }

  async getBanks(): Promise<Bank[]> {
    const { data } = await this.client.get('/bank?country=nigeria');
    return data.data;
  }

  async assignAccount(payload: AssignAccountDto) {
    const { data } = await this.client.post(
      '/dedicated_account/assign',
      payload,
    );

    return data;
  }

  async verifyAccountNumber({
    accountNumber,
    bankCode,
  }: {
    accountNumber: string;
    bankCode: string;
  }) {
    const { data } = await this.client.get(
      `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
    );
    return data.data;
  }

  async createTransferRecipient(
    payload: CreateTransferRecipientDto,
  ): Promise<CreateTransferRecipientResponse> {
    const { data } = await this.client.post<CreateTransferRecipientResponse>(
      '/transferrecipient',
      {
        type: 'nuban',
        currency: 'NGN',
        ...payload,
      },
    );
    return data;
  }

  async initiateTransfer(payload: {
    amount: number;
    reference: string;
    reason: string;
    recipient: string;
  }) {
    try {
      const { data } = await this.client.post('/transfer', {
        source: 'balance',
        ...payload,
      });

      return data;
    } catch (err) {
      throw new BadRequestException(err.response.data.message);
    }
  }
}