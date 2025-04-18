import { Prisma, ROLE } from "@prisma/client";
import { TContext, TFilters } from "../../types";
import auth from "../../utils/auth";
import { TLocationCreateInput, TLocationUpdateInput } from "./location.type";
import { Location } from ".";
import calculatePagination from "../../utils/calculatePagination";
import AppError from "../../errors/AppError";
import status from "http-status";

const queries = {
  getAllLocations: async (_: any, queries: TFilters, { prisma }: TContext) => {
    const { page, limit, skip, sortBy, sortOrder } =
      calculatePagination(queries);

    const conditions: Prisma.LocationWhereInput = {};

    const searchableFields = ["name", "mapUrl", "address", "phoneNumber"];

    if (queries?.searchTerm) {
      conditions.OR = searchableFields.map((field) => ({
        [field]: {
          contains: queries?.searchTerm,
          mode: "insensitive",
        },
      }));
    }

    const locations = await prisma.location.findMany({
      where: conditions,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    const total = await prisma.location.count({
      where: conditions,
    });

    const meta = {
      page,
      limit,
      total,
    };

    return { locations, meta };
  },

  location: async (_: any, args: { id: string }, { prisma }: TContext) => {
    if (!args.id) {
      throw new AppError(status.BAD_REQUEST, "Location ID is required.");
    }

    const location = await prisma.location.findUnique({
      where: { id: args.id },
    });

    return location;
  },
};

const mutations = {
  createLocation: async (
    _: any,
    args: TLocationCreateInput,
    { prisma, currentUser }: TContext
  ) => {
    await auth(prisma, currentUser, [ROLE.ADMIN, ROLE.SUPER_ADMIN]);

    const parsedData = await Location.validations.create.parseAsync(args);

    const location = await prisma.location.create({
      data: parsedData,
    });

    return location;
  },

  updateLocation: async (
    _: any,
    args: TLocationUpdateInput,
    { prisma, currentUser }: TContext
  ) => {
    await auth(prisma, currentUser, [ROLE.ADMIN, ROLE.SUPER_ADMIN]);

    const parsedData = await Location.validations.update.parseAsync(args);
    const { locationId, ...updateData } = parsedData;

    const isLocation = await prisma.location.findUnique({
      where: { id: locationId },
      select: { id: true },
    });

    if (!isLocation) {
      throw new AppError(status.NOT_FOUND, "Location not found.");
    }

    const location = await prisma.location.update({
      where: { id: locationId },
      data: updateData,
    });

    return location;
  },

  removeLocations: async (
    _: any,
    args: { ids: string[] },
    { prisma, currentUser }: TContext
  ) => {
    await auth(prisma, currentUser, [ROLE.ADMIN, ROLE.SUPER_ADMIN]);

    const parsedData = await Location.validations.remove.parseAsync(args);

    const locations = await prisma.location.findMany({
      where: { id: { in: parsedData.ids } },
      include: {
        _count: {
          select: {
            doctors: true,
          },
        },
      },
    });

    locations.forEach((location) => {
      if (location._count.doctors > 0) {
        throw new AppError(
          status.BAD_REQUEST,
          `Location ${location.name} has doctors.`
        );
      }
    });

    const locationsToDelete = locations.map((location) => location.id);

    await prisma.location.deleteMany({
      where: { id: { in: locationsToDelete } },
    });

    return { success: true };
  },
};

export const resolvers = { queries, mutations };
