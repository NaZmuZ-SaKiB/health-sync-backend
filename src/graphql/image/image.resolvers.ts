import { Prisma, ROLE } from "@prisma/client";
import { TContext } from "../../types";
import auth from "../../utils/auth";
import { TImageCreateInput } from "./image.type";
import { Image } from ".";

const queries = {
  images: async (_: any, __: any, { prisma, currentUser }: TContext) => {
    await auth(prisma, currentUser);

    const conditions: Prisma.ImageWhereInput = {};

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

    const images = await prisma.image.findMany({ where: conditions });

    return images;
  },
};

const mutations = {
  createImage: async (
    _: any,
    args: TImageCreateInput,
    { prisma, currentUser }: TContext
  ) => {
    await auth(prisma, currentUser);

    const parsedData = await Image.validations.create.parseAsync(args);

    await prisma.image.create({
      data: {
        ...parsedData,
        userId: currentUser?.id as string,
        userType: currentUser?.role as ROLE,
      },
    });

    return { success: true };
  },
};

export const resolvers = { queries, mutations };
