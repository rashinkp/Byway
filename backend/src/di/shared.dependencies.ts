import { prismaClient } from "../infra/prisma/client";
import { PrismaInstructorRepository } from "../infra/repositories/instructor.repository.impl";
import { UserRepository } from "../infra/repositories/user.repository.impl";
import { CategoryRepository } from "../infra/repositories/category.repository.impl";
import { CourseRepository } from "../infra/repositories/course.repository.impl";
import { AuthRepository } from "../infra/repositories/auth.repository.impl";
import { EnrollmentRepository } from "../infra/repositories/enrollment.repository.impl";
import { OtpProvider } from "../infra/providers/otp/otp.provider";
import { GoogleAuthProvider } from "../infra/providers/auth/google-auth.provider";
import { envConfig } from "../presentation/express/configs/env.config";
import { ICategoryRepository } from "../app/repositories/category.repository";
import { ICourseRepository } from "../app/repositories/course.repository.interface";
import { IInstructorRepository } from "../app/repositories/instructor.repository";
import { IAuthRepository } from "../app/repositories/auth.repository";
import { IEnrollmentRepository } from "../app/repositories/enrollment.repository.interface";
import { ILessonRepository } from "../app/repositories/lesson.repository";
import { HttpErrors } from "../presentation/http/http.errors";
import { HttpSuccess } from "../presentation/http/http.success";
import { CookieService } from "../presentation/http/utils/cookie.service";
import { LessonRepository } from "../infra/repositories/lesson.repository.impl";
import { LessonContentRepository } from "../infra/repositories/content.repository";
import { ILessonContentRepository } from "../app/repositories/content.repository";
import { CartRepository } from "../infra/repositories/cart.repository.impl";
import { ICartRepository } from "../app/repositories/cart.repository";
import { OrderRepository } from "../infra/repositories/order.repository.impl";
import { IOrderRepository } from "../app/repositories/order.repository";
import { TransactionRepository } from "../infra/repositories/transaction.repository.impl";
import { ITransactionRepository } from "../app/repositories/transaction.repository";
import { IWalletRepository } from "../app/repositories/wallet.repository.interface";
import { WalletRepository } from "../infra/repositories/wallet.repository";
import { PaymentService } from "../app/services/payment/implementations/payment.service";
import { IPaymentService } from "../app/services/payment/interfaces/payment.service.interface";
import { StripePaymentGateway } from "../infra/providers/stripe-payment.gateway";
import { StripeWebhookGateway } from "../infra/providers/stripe-webhook.gateway";
import { RevenueDistributionService } from "../app/services/revenue-distribution/implementations/revenue-distribution.service";
import { IUserRepository } from "@/app/repositories/user.repository";
import { PrismaRevenueRepository } from "../infra/repositories/revenue.repository";
import { IRevenueRepository } from "../app/repositories/revenue.repository";
import { CourseReviewRepository } from "../infra/repositories/course-review.repository.impl";
import { ICourseReviewRepository } from "../app/repositories/course-review.repository.interface";
import { LessonProgressRepository } from "../infra/repositories/lesson-progress.repository.impl";
import { ILessonProgressRepository } from "../app/repositories/lesson-progress.repository.interface";
import { PrismaCertificateRepository } from "../infra/repositories/certificate-repository.prisma";
import { CertificateRepositoryInterface } from "../app/repositories/certificate-repository.interface";
import { CreateNotificationsForUsersUseCase } from "../app/usecases/notification/implementations/create-notifications-for-users.usecase";

export interface SharedDependencies {
  prisma: typeof prismaClient;
  userRepository: IUserRepository;
  categoryRepository: ICategoryRepository;
  courseRepository: ICourseRepository;
  instructorRepository: IInstructorRepository;
  authRepository: IAuthRepository;
  enrollmentRepository: IEnrollmentRepository;
  lessonRepository: ILessonRepository;
  lessonContentRepository: ILessonContentRepository;
  cartRepository: ICartRepository;
  orderRepository: IOrderRepository;
  transactionRepository: ITransactionRepository;
  revenueRepository: IRevenueRepository;
  courseReviewRepository: ICourseReviewRepository;
  otpProvider: OtpProvider;
  googleAuthProvider: GoogleAuthProvider;
  httpErrors: HttpErrors;
  httpSuccess: HttpSuccess;
  cookieService: CookieService;
  walletRepository: IWalletRepository;
  paymentService: IPaymentService;
  createNotificationsForUsersUseCase: CreateNotificationsForUsersUseCase;
  lessonProgressRepository: ILessonProgressRepository;
  certificateRepository: CertificateRepositoryInterface;
}

export function createSharedDependencies(createNotificationsForUsersUseCase?: CreateNotificationsForUsersUseCase): SharedDependencies {
  const userRepository = new UserRepository(prismaClient);
  const categoryRepository = new CategoryRepository(prismaClient);
  const courseRepository = new CourseRepository(prismaClient);
  const instructorRepository = new PrismaInstructorRepository(prismaClient);
  const authRepository = new AuthRepository(prismaClient);
  const enrollmentRepository = new EnrollmentRepository(prismaClient);
  const lessonRepository = new LessonRepository(prismaClient);
  const lessonContentRepository = new LessonContentRepository(prismaClient);
  const cartRepository = new CartRepository(prismaClient);
  const orderRepository = new OrderRepository(prismaClient);
  const transactionRepository = new TransactionRepository(prismaClient);
  const courseReviewRepository = new CourseReviewRepository(prismaClient);
  const otpProvider = new OtpProvider(authRepository);
  const googleAuthProvider = new GoogleAuthProvider(envConfig.GOOGLE_CLIENT_ID);
  const walletRepository = new WalletRepository(prismaClient);
  const paymentGateway = new StripePaymentGateway();
  const webhookGateway = new StripeWebhookGateway();
  const revenueDistributionService = new RevenueDistributionService(
    walletRepository,
    transactionRepository,
    orderRepository,
    userRepository,
    createNotificationsForUsersUseCase!
  );
  const paymentService = new PaymentService(
    walletRepository,
    orderRepository,
    transactionRepository,
    enrollmentRepository,
    paymentGateway,
    webhookGateway,
    userRepository,
    revenueDistributionService
  );

  const httpErrors = new HttpErrors();
  const httpSuccess = new HttpSuccess();
  const cookieService = new CookieService();

  const revenueRepository = new PrismaRevenueRepository(prismaClient);
  const lessonProgressRepository = new LessonProgressRepository(prismaClient);
  const certificateRepository = new PrismaCertificateRepository(prismaClient);

  return {
    prisma: prismaClient,
    userRepository,
    categoryRepository,
    courseRepository,
    instructorRepository,
    authRepository,
    enrollmentRepository,
    lessonRepository,
    lessonContentRepository,
    cartRepository,
    orderRepository,
    transactionRepository,
    revenueRepository,
    courseReviewRepository,
    otpProvider,
    googleAuthProvider,
    httpErrors,
    httpSuccess,
    cookieService,
    walletRepository,
    paymentService,
    createNotificationsForUsersUseCase: createNotificationsForUsersUseCase!,
    lessonProgressRepository,
    certificateRepository,
  };
}
