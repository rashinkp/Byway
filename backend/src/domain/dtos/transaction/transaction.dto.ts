import { PaymentGateway } from "../../enum/payment-gateway.enum";
import { TransactionStatus } from "../../enum/transaction-status.enum";
import { TransactionType } from "../../enum/transaction-type.enum";

export interface ICreateTransactionInputDTO {
  orderId?: string;
  userId: string;
  amount: number;
  type?: TransactionType;
  status?: TransactionStatus;
  paymentGateway?: PaymentGateway;
  paymentMethod?: string;
  paymentDetails?: Record<string, any>;
  courseId?: string;
  transactionId?: string;
  metadata?: Record<string, any>;
}

export interface ITransactionOutputDTO {
  id: string;
  orderId?: string;
  userId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  paymentGateway: PaymentGateway;
  paymentMethod?: string;
  paymentDetails?: Record<string, any>;
  courseId?: string;
  transactionId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateTransactionStatusInputDTO {
  id: string;
  status: TransactionStatus;
  metadata?: Record<string, any>;
}

export interface IGetTransactionsByUserInputDTO {
  userId: string;
  page?: number;
  limit?: number;
}

export interface IGetTransactionsByOrderInputDTO {
  orderId: string;
  page?: number;
  limit?: number;
}
