import { PAYMENT_STATUS, ROLE } from "@prisma/client";
import { TContext } from "../../types";
import auth from "../../utils/auth";
import { TPaymentUpdateInput } from "./payment.type";
import { Payment } from ".";
import AppError from "../../errors/AppError";
import status from "http-status";

const queries = {};

const mutations = {
  updatePayment: async (
    _: any,
    args: TPaymentUpdateInput,
    { prisma, currentUser }: TContext
  ) => {
    await auth(prisma, currentUser, [
      ROLE.DOCTOR,
      ROLE.ADMIN,
      ROLE.SUPER_ADMIN,
    ]);

    const parsedData = await Payment.validations.update.parseAsync(args);

    const isPaymentExist = await prisma.payment.findUnique({
      where: { id: parsedData.paymentId },
      select: {
        id: true,
        status: true,
        appointment: {
          select: {
            doctor: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!isPaymentExist) {
      throw new AppError(status.NOT_FOUND, "Payment not found");
    }

    if (
      currentUser?.role === ROLE.DOCTOR &&
      isPaymentExist.appointment.doctor.userId !== currentUser.id
    ) {
      throw new AppError(
        status.FORBIDDEN,
        "You are not allowed to update this payment"
      );
    }

    const { paymentId, ...updateData } = parsedData;

    if (
      updateData.status === PAYMENT_STATUS.COMPLETED &&
      isPaymentExist.status !== PAYMENT_STATUS.PENDING
    ) {
      throw new AppError(status.BAD_REQUEST, "Invalid payment status");
    }

    if (
      updateData.status === PAYMENT_STATUS.REFUNDED &&
      isPaymentExist.status !== PAYMENT_STATUS.COMPLETED
    ) {
      throw new AppError(status.BAD_REQUEST, "Invalid payment status");
    }

    await prisma.payment.update({
      where: { id: paymentId },
      data: updateData,
    });

    return { success: true };
  },
};

export const resolvers = { queries, mutations };
