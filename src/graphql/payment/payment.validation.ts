import { PAYMENT_STATUS } from "@prisma/client";
import { z } from "zod";

const status = z.enum(
  Object.values(PAYMENT_STATUS) as [PAYMENT_STATUS, ...PAYMENT_STATUS[]],
  {
    errorMap: () => ({
      message: "Invalid Payment Status.",
    }),
  },
);

const update = z.object({
  paymentId: z.string().min(1, "Payment ID must be provided."),
  transactionId: z.string().optional(),
  status: status.optional(),
});

const paymentInit = z.object({
  appointmentId: z.string().optional(),
});

export const validations = { update, paymentInit };
