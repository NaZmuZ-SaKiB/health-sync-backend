import { APPOINTMENT_STATUS, PAYMENT_STATUS, Prisma } from "@prisma/client";
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

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data,
    });

    if (data.status === PAYMENT_STATUS.COMPLETED) {
      await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          status: APPOINTMENT_STATUS.SCHEDULED,
        },
      });
    }
  });
};

export const PaymentService = {
  updatePayment,
};
