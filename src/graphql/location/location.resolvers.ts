import { ROLE } from "@prisma/client";
import { TContext } from "../../types";
import auth from "../../utils/auth";
import { TLocationCreateInput } from "./location.type";
import { Location } from ".";

const queries = {
  locations: async (_: any, __: any, { prisma }: TContext) => {
    const locations = await prisma.location.findMany({});

    return locations;
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
