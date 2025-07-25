import { TransactionType } from "../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../domain/enum/transaction-status.enum";
import { GetLatestRevenueParams, GetLatestRevenueResult } from "../../domain/dtos/revenue/get-latest-revenue.dto";

export interface GetCourseTransactionsParams {
  startDate: Date;
  endDate: Date;
  type: TransactionType;
  status: TransactionStatus;
  userId?: string;
}

export interface GetCourseDetailsParams {
  courseIds: string[];
}

export interface GetTotalCoursesParams {
  startDate: Date;
  endDate: Date;
  userId?: string;
  search?: string;
}

export interface IRevenueRepository {
  getTransactionAmounts(params: {
    startDate: Date;
    endDate: Date;
    type: TransactionType;
    status: TransactionStatus;
    userId: string;
  }): Promise<{ amount: number }>;

  getTransactionCounts(params: {
    startDate: Date;
    endDate: Date;
    type?: TransactionType;
    status?: TransactionStatus;
    userId: string;
  }): Promise<number>;

  getCourseTransactions(params: GetCourseTransactionsParams): Promise<Array<{
    courseId: string;
    amount: number;
    count: number;
  }>>;

  getCourseDetails(params: GetCourseDetailsParams): Promise<Array<{
    id: string;
    title: string;
    thumbnail: string | null;
    creator: {
      id: string;
      name: string;
      avatar: string | null;
    };
    adminSharePercentage: number;
  }>>;

  getTotalCourses(params: GetTotalCoursesParams): Promise<number>;

  getLatestRevenue(params: GetLatestRevenueParams): Promise<{
    items: GetLatestRevenueResult['items'];
    total: number;
  }>;

  getTotalRevenue(userId: string): Promise<number>;
} 