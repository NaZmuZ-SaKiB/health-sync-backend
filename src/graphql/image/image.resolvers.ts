import { Prisma, ROLE } from "@prisma/client";
import { TContext, TFilters } from "../../types";
import auth from "../../utils/auth";
import { TImageCreateInput } from "./image.type";
import { Image } from ".";
import calculatePagination from "../../utils/calculatePagination";

const queries = {
  getAllImages: async (
    _: any,
    queries: TFilters,
    { prisma, currentUser }: TContext
  ) => {
    await auth(prisma, currentUser);

    const { page, limit, skip, sortBy, sortOrder } =
      calculatePagination(queries);

    const conditions: Prisma.ImageWhereInput = {};

    const searchableFields = [
      "name",
      "publicId",
      "secureUrl",
      "url",
      "thumbnailUrl",
    ];

    if (queries?.searchTerm) {
      conditions.OR = searchableFields.map((field) => ({
        [field]: {
          contains: queries?.searchTerm,
          mode: "insensitive",
        },
      }));
    }

    if (
      currentUser?.role === ROLE.PATIENT ||
      currentUser?.role === ROLE.DOCTOR
    ) {
      conditions.userId = currentUser?.id;
    } else {
      conditions.userType = {
        in: [ROLE.ADMIN, ROLE.SUPER_ADMIN],
      };
    }

    const images = await prisma.image.findMany({
      where: conditions,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    const total = await prisma.image.count({
      where: conditions,
    });

    const meta = {
      page,
      limit,
      total,
    };

    return { images, meta };
  },
};

const mutations = {
  createImages: async (
    _: any,
    args: TImageCreateInput,
    { prisma, currentUser }: TContext
  ) => {
    await auth(prisma, currentUser);

    const parsedData = await Image.validations.create.parseAsync(args.input);

    await prisma.image.createMany({
      data: parsedData.map((item) => ({
        ...item,
        userId: currentUser?.id as string,
        userType: currentUser?.role as ROLE,
      })),
    });

    return { success: true };
  },
};

export const resolvers = { queries, mutations };
