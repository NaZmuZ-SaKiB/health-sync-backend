import { PAYMENT_STATUS, Prisma } from "@prisma/client";
import { prisma } from "../..";

const updatePayment = async (
  appointmentId: string,
  data: Prisma.PaymentUpdateInput,
) => {
  const payment = await prisma.payment.findFirst({
    where: { appointmentId },
    select: {
      id: true,
    },
  });

  if (!payment) return;

  await prisma.payment.update({
    where: { id: payment.id },
    data,
  });
};

export const PaymentService = {
  updatePayment,
};
