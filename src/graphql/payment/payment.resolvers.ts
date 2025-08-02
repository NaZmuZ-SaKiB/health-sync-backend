import { APPOINTMENT_STATUS, PAYMENT_STATUS, ROLE } from "@prisma/client";
import { TContext } from "../../types";
import auth from "../../utils/auth";
import { TPaymentInitInput, TPaymentUpdateInput } from "./payment.type";
import { Payment } from ".";
import AppError from "../../errors/AppError";
import status from "http-status";
import { utils } from "./payment.utils";
import config from "../../config";
import axios from "axios";

const queries = {};

const mutations = {
  updatePayment: async (
    _: any,
    args: TPaymentUpdateInput,
    { prisma, currentUser }: TContext,
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
      isPaymentExist?.appointment?.doctor?.userId !== currentUser.id
    ) {
      throw new AppError(
        status.FORBIDDEN,
        "You are not allowed to update this payment",
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

  paymentInit: async (
    _: any,
    args: TPaymentInitInput,
    { currentUser, prisma }: TContext,
  ) => {
    await auth(prisma, currentUser, [ROLE.PATIENT]);

    const parsedData = await Payment.validations.paymentInit.parseAsync(args);

    const user = await prisma.user.findUnique({
      where: { id: currentUser?.id },
    });

    let appointmentId: string;

    if (parsedData.appointmentId) {
      appointmentId = parsedData.appointmentId;
    } else {
      const lastAppointment = await prisma.appointment.findFirst({
        where: {
          patient: {
            userId: user?.id,
          },
          payment: {
            status: PAYMENT_STATUS.PENDING,
          },
          status: APPOINTMENT_STATUS.SCHEDULED,
        },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });

      appointmentId = lastAppointment?.id || "";
    }

    if (!appointmentId) {
      throw new AppError(status.NOT_FOUND, "Appointment not found");
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: {
        id: true,
        service: {
          select: {
            name: true,
          },
        },
        doctor: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        payment: {
          select: {
            amount: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new AppError(status.NOT_FOUND, "Appointment not found");
    }

    const paymentData = utils.getPaymentData({
      name: user?.firstName + " " + user?.lastName,
      email: user?.email,
      phone: user?.phoneNumber,
      address: user?.address,
      appointmentId: appointment.id,
      amount: appointment?.payment?.amount,
      service:
        appointment?.service?.name ||
        appointment?.doctor?.user?.firstName +
          " " +
          appointment?.doctor?.user?.lastName,
    });

    const response = await axios({
      method: "post",
      url: config.ssl.sessionUrl,
      data: paymentData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data?.GatewayPageURL;
  },
};

export const resolvers = { queries, mutations };
