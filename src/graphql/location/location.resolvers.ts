import { ROLE } from "@prisma/client";
import { TContext } from "../../types";
import auth from "../../utils/auth";
import { TLocationCreateInput } from "./location.type";
import { Location } from ".";

const queries = {};

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
