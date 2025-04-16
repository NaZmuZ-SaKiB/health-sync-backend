import { Prisma, ROLE } from "@prisma/client";
import { TContext, TFilters } from "../../types";
import auth from "../../utils/auth";
import { TLocationCreateInput } from "./location.type";
import { Location } from ".";
import calculatePagination from "../../utils/calculatePagination";

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
};

const mutations = {
  createLocation: async (
    _: any,
    args: TLocationCreateInput,
    { prisma, currentUser }: TContext
  ) => {
    await auth(prisma, currentUser, [ROLE.ADMIN, ROLE.SUPER_ADMIN]);

    const parsedData = await Location.validations.create.parseAsync(args);

    await prisma.location.create({
      data: parsedData,
    });

    return { success: true };
  },
};

export const resolvers = { queries, mutations };
