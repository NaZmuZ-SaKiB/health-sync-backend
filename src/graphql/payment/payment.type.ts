import { PAYMENT_STATUS } from "@prisma/client";

export type TPaymentUpdateInput = {
  paymentId: string;
  transactionId?: string;
  status?: PAYMENT_STATUS;
};

export type TPaymentInitInput = {
  appointmentId?: string;
};
