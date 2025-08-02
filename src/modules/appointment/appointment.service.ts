import { APPOINTMENT_STATUS, PAYMENT_STATUS } from "@prisma/client";
import { prisma } from "../..";

const cancelUnpaidAppointments = async () => {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const unpaidAppointments = await prisma.appointment.findMany({
      where: {
        createdAt: {
          lte: thirtyMinutesAgo,
        },
        status: APPOINTMENT_STATUS.SCHEDULED,
        payment: {
          status: {
            not: {
              equals: PAYMENT_STATUS.COMPLETED,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    const unpaidAppointmentIds = unpaidAppointments.map(
      (appointment) => appointment.id,
    );

    await prisma.appointment.updateMany({
      where: {
        id: {
          in: unpaidAppointmentIds,
        },
      },
      data: {
        status: APPOINTMENT_STATUS.CANCELLED,
      },
    });
  } catch (error) {
    console.error("Unpaid Appointment Error:", error);
  }
};

export const AppointmentService = {
  cancelUnpaidAppointments,
};
