import { ROLE } from "@prisma/client";
import { TContext } from "../../types";
import auth from "../../utils/auth";
import { TServiceSettingsUpdateInput } from "./service-settings.type";
import { ServiceSettings } from ".";
import AppError from "../../errors/AppError";
import status from "http-status";

const queries = {
  serviceSettings: async (
    _: any,
    args: { serviceId: string },
    { prisma }: TContext,
  ) => {
    return await prisma.serviceSettings.findFirst({
      where: { service: { id: args.serviceId } },
    });
  },
};

const mutations = {
  updateServiceSettings: async (
    _: any,
    args: TServiceSettingsUpdateInput,
    { prisma, currentUser }: TContext,
  ) => {
    await auth(prisma, currentUser, [ROLE.SUPER_ADMIN, ROLE.ADMIN]);

    const parsedData =
      await ServiceSettings.validations.update.parseAsync(args);

    const isService = await prisma.service.findUnique({
      where: { id: parsedData.serviceId },
      select: { id: true, serviceSettingsId: true },
    });

    if (!isService) {
      throw new AppError(status.NOT_FOUND, "Service not found.");
    }

    const { serviceId, ...updateData } = parsedData;

    if (isService?.serviceSettingsId) {
      await prisma.serviceSettings.update({
        where: {
          id: isService?.serviceSettingsId,
        },
        data: updateData,
      });
    } else {
      await prisma.serviceSettings.create({
        data: {
          ...updateData,
          service: {
            connect: {
              id: serviceId,
            },
          },
        },
      });
    }

    return { success: true };
  },
};

export const resolvers = { queries, mutations };
