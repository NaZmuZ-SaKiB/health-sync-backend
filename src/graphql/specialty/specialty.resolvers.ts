import { ROLE } from "@prisma/client";
import { TContext } from "../../types";
import auth from "../../utils/auth";
import { TSpecialtyCreate, TSpecialtyUpdate } from "./specialty.type";
import { Specialty } from ".";
import AppError from "../../errors/AppError";
import status from "http-status";

const queries = {
  specialties: async (_: any, __: any, { prisma }: TContext) => {
    const specialties = await prisma.specialty.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return specialties;
  },
};

const mutations = {
  createSpecialty: async (
    _: any,
    args: TSpecialtyCreate,
    { prisma, currentUser }: TContext
  ) => {
    await auth(prisma, currentUser, [ROLE.ADMIN, ROLE.SUPER_ADMIN]);

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

  updateSpecialty: async (
    _: any,
    args: TSpecialtyUpdate,
    { prisma, currentUser }: TContext
  ) => {
    await auth(prisma, currentUser, [ROLE.ADMIN, ROLE.SUPER_ADMIN]);

    const parsedData = await Specialty.validations.update.parseAsync(args);

    const { specialtyId, ...updateData } = parsedData;

    const specialty = await prisma.specialty.findUnique({
      where: { id: parsedData.specialtyId },
      select: { id: true },
    });

    if (!specialty) {
      throw new AppError(status.NOT_FOUND, "Specialty not found.");
    }

    await prisma.specialty.update({
      where: { id: parsedData.specialtyId },
      data: updateData,
    });

    return { success: true };
  },
};

export const resolvers = { queries, mutations };
