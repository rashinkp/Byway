import {
  PrismaClient,
  TransactionHistory,
  TransactionType as PrismaTransactionType,
  TransactionStatus as PrismaTransactionStatus,
  PaymentGateway as PrismaPaymentGateway,
} from "@prisma/client";
import { ITransactionRepository } from "../../app/repositories/transaction.repository";
import { Transaction } from "../../domain/entities/transaction.entity";
import { TransactionStatus } from "../../domain/enum/transaction-status.enum";
import { PaymentGateway } from "../../domain/enum/payment-gateway.enum";
import { TransactionType } from "../../domain/enum/transaction-type.enum";

export class TransactionRepository implements ITransactionRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToTransaction(prismaTransaction: TransactionHistory): Transaction {
    return new Transaction({
      id: prismaTransaction.id,
      orderId: prismaTransaction.orderId,
      userId: prismaTransaction.userId,
      amount: Number(prismaTransaction.amount),
      type: this.mapPrismaTransactionType(prismaTransaction.type),
      status: this.mapPrismaTransactionStatus(prismaTransaction.status),
      paymentGateway: this.mapPrismaPaymentGateway(
        prismaTransaction.paymentGateway
      ),
      courseId: prismaTransaction.courseId || undefined,
      transactionId: prismaTransaction.transactionId || undefined,
      createdAt: prismaTransaction.createdAt,
      updatedAt: prismaTransaction.updatedAt,
    });
  }

  private mapPrismaTransactionType(
    type: PrismaTransactionType
  ): TransactionType {
    switch (type) {
      case "PAYMENT":
        return TransactionType.PURCHASE;
      case "REFUND":
        return TransactionType.REFUND;
      default:
        throw new Error(`Unknown transaction type: ${type}`);
    }
  }

  private mapPrismaTransactionStatus(
    status: PrismaTransactionStatus
  ): TransactionStatus {
    switch (status) {
      case "PENDING":
        return TransactionStatus.PENDING;
      case "COMPLETED":
        return TransactionStatus.COMPLETED;
      case "FAILED":
        return TransactionStatus.FAILED;
      default:
        throw new Error(`Unknown transaction status: ${status}`);
    }
  }

  private mapPrismaPaymentGateway(
    gateway: PrismaPaymentGateway | null
  ): PaymentGateway {
    if (!gateway) {
      throw new Error("Payment gateway is required");
    }
    switch (gateway) {
      case "STRIPE":
        return PaymentGateway.STRIPE;
      case "PAYPAL":
        return PaymentGateway.PAYPAL;
      case "RAZORPAY":
        return PaymentGateway.RAZORPAY;
      default:
        throw new Error(`Unknown payment gateway: ${gateway}`);
    }
  }

  private mapToPrismaTransactionType(
    type: TransactionType
  ): PrismaTransactionType {
    switch (type) {
      case TransactionType.PURCHASE:
        return "PAYMENT";
      case TransactionType.REFUND:
        return "REFUND";
      default:
        throw new Error(`Unknown transaction type: ${type}`);
    }
  }

  private mapToPrismaTransactionStatus(
    status: TransactionStatus
  ): PrismaTransactionStatus {
    switch (status) {
      case TransactionStatus.PENDING:
        return "PENDING";
      case TransactionStatus.COMPLETED:
        return "COMPLETED";
      case TransactionStatus.FAILED:
        return "FAILED";
      default:
        throw new Error(`Unknown transaction status: ${status}`);
    }
  }

  private mapToPrismaPaymentGateway(
    gateway: PaymentGateway
  ): PrismaPaymentGateway {
    switch (gateway) {
      case PaymentGateway.STRIPE:
        return "STRIPE";
      case PaymentGateway.PAYPAL:
        return "PAYPAL";
      case PaymentGateway.RAZORPAY:
        return "RAZORPAY";
      default:
        throw new Error(`Unknown payment gateway: ${gateway}`);
    }
  }

  async create(transaction: Transaction): Promise<Transaction> {
    const created = await this.prisma.transactionHistory.create({
      data: {
        orderId: transaction.orderId,
        userId: transaction.userId,
        amount: transaction.amount,
        type: this.mapToPrismaTransactionType(transaction.type),
        status: this.mapToPrismaTransactionStatus(transaction.status),
        paymentGateway: this.mapToPrismaPaymentGateway(
          transaction.paymentGateway
        ),
        courseId: transaction.courseId,
        transactionId: transaction.transactionId,
      },
    });
    return this.mapToTransaction(created);
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transactionHistory.findUnique({
      where: { id },
    });
    return transaction ? this.mapToTransaction(transaction) : null;
  }

  async findByOrderId(orderId: string): Promise<Transaction[]> {
    const transactions = await this.prisma.transactionHistory.findMany({
      where: { orderId },
    });
    return transactions.map((t) => this.mapToTransaction(t));
  }

  async findByUserId(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<Transaction[]> {
    const transactions = await this.prisma.transactionHistory.findMany({
      where: { userId },
      skip: page ? (page - 1) * (limit || 10) : undefined,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return transactions.map((t) => this.mapToTransaction(t));
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
    metadata?: Record<string, any>
  ): Promise<Transaction> {
    const updated = await this.prisma.transactionHistory.update({
      where: { id },
      data: {
        status: this.mapToPrismaTransactionStatus(status),
        ...(metadata && { metadata: JSON.stringify(metadata) }),
      },
    });
    return this.mapToTransaction(updated);
  }
}
