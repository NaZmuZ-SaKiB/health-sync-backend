import { ROLE } from "@prisma/client";
import { TContext } from "../../types";
import auth from "../../utils/auth";
import { TServiceCreateInput } from "./service.type";
import { Service } from ".";
import AppError from "../../errors/AppError";
import status from "http-status";

const queries = {};

const mutations = {
  createService: async (
    _: any,
    args: TServiceCreateInput,
    { prisma, currentUser }: TContext
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
};

export const resolvers = { queries, mutations };
