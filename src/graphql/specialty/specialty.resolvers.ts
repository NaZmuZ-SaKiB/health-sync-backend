import { ROLE } from "@prisma/client";
import { TContext } from "../../types";
import auth from "../../utils/auth";
import { TSpecialtyCreate } from "./specialty.type";
import { Specialty } from ".";
import AppError from "../../errors/AppError";
import status from "http-status";

const queries = {};

const mutations = {
  createSpecialty: async (
    _: any,
    args: TSpecialtyCreate,
    { prisma, currentUser }: TContext
  ) => {
    auth(currentUser, [ROLE.ADMIN, ROLE.SUPER_ADMIN]);

    const parsedData = await Specialty.validations.create.parseAsync(args);

    const isExist = await prisma.specialty.findFirst({
      where: { name: parsedData.name },
      select: { id: true },
    });

    if (!!isExist) {
      throw new AppError(status.CONFLICT, "Specialty already exists.");
    }

    await prisma.specialty.create({ data: parsedData });

    return { success: true };
  },
};

export const resolvers = { queries, mutations };
