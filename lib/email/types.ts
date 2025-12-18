export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export interface WelcomeEmailData {
  userName: string;
  userEmail: string;
}

export interface PasswordResetEmailData {
  userEmail: string;
  resetLink: string;
  expiresIn?: string;
}

export interface SubscriptionEmailData {
  userEmail: string;
  planName: string;
  amount?: string;
  billingPeriod?: string;
}

export interface UsageWarningEmailData {
  userEmail: string;
  usage: number;
  limit: number;
  percentage: number;
  featureName?: string;
}

export interface PaymentFailedEmailData {
  userEmail: string;
  amount: string;
  lastPaymentDate: string;
  retryDate?: string;
  supportLink?: string;
}
