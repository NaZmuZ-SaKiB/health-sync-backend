import { Prisma, ROLE, Service as TService } from "@prisma/client";
import { TContext, TFilters } from "../../types";
import auth from "../../utils/auth";
import { TServiceCreateInput, TServiceUpdateInput } from "./service.type";
import { Service } from ".";
import AppError from "../../errors/AppError";
import status from "http-status";
import calculatePagination from "../../utils/calculatePagination";

const queries = {
  getAllServices: async (_: any, queries: TFilters, { prisma }: TContext) => {
    const { page, limit, skip, sortBy, sortOrder } =
      calculatePagination(queries);

    const conditions: Prisma.ServiceWhereInput = {};

    if (queries?.searchTerm) {
      conditions.OR = ["name"].map((field) => ({
        [field]: {
          contains: queries?.searchTerm,
          mode: "insensitive",
        },
      }));
    }

    const services = await prisma.service.findMany({
      where: conditions,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    const total = await prisma.service.count({
      where: conditions,
    });

    const meta = {
      page,
      limit,
      total,
    };

    return { services, meta };
  },

  service: async (_: any, args: { id: string }, { prisma }: TContext) => {
    if (!args.id) {
      throw new AppError(status.BAD_REQUEST, "Service ID is required.");
    }

    const service = await prisma.service.findUnique({
      where: { id: args.id },
    });

    return service;
  },
};

const relationalQuery = {
  Service: {
    serviceSettings: async (parent: TService, _: any, { prisma }: TContext) => {
      if (!parent.serviceSettingsId) return null;

      return await prisma.serviceSettings.findUnique({
        where: { id: parent.serviceSettingsId },
      });
    },
  },
};

const mutations = {
  createService: async (
    _: any,
    args: TServiceCreateInput,
    { prisma, currentUser }: TContext,
  ) => {
    await auth(prisma, currentUser, [ROLE.ADMIN, ROLE.SUPER_ADMIN]);

    const parsedData = await Service.validations.create.parseAsync(args);

    const isExist = await prisma.service.findUnique({
      where: { name: parsedData.name },
      select: { id: true },
    });

    if (!!isExist) {
      throw new AppError(status.CONFLICT, "Service already exists.");
    }

    await prisma.service.create({ data: parsedData });

    return { success: true };
  },

  updateService: async (
    _: any,
    args: TServiceUpdateInput,
    { prisma, currentUser }: TContext,
  ) => {
    await auth(prisma, currentUser, [ROLE.ADMIN, ROLE.SUPER_ADMIN]);

    const parsedData = await Service.validations.update.parseAsync(args);

    const { serviceId, ...updateData } = parsedData;

    const isService = await prisma.service.findUnique({
      where: { id: parsedData.serviceId },
      select: { id: true },
    });

    if (!isService) {
      throw new AppError(status.NOT_FOUND, "Service not found.");
    }

    const service = await prisma.service.update({
      where: { id: parsedData.serviceId },
      data: updateData,
    });

    return service;
  },
};

export const resolvers = { queries, relationalQuery, mutations };
