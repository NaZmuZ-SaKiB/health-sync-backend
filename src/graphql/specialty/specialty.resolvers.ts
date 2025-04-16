import { Prisma, ROLE } from "@prisma/client";
import { TContext, TFilters } from "../../types";
import auth from "../../utils/auth";
import { TSpecialtyCreate, TSpecialtyUpdate } from "./specialty.type";
import { Specialty } from ".";
import AppError from "../../errors/AppError";
import status from "http-status";
import calculatePagination from "../../utils/calculatePagination";

const queries = {
  getAllSpecialties: async (
    _: any,
    queries: TFilters,
    { prisma }: TContext
  ) => {
    const { page, limit, skip, sortBy, sortOrder } =
      calculatePagination(queries);

    const conditions: Prisma.SpecialtyWhereInput = {};

    if (queries?.searchTerm) {
      conditions.OR = ["name"].map((field) => ({
        [field]: {
          contains: queries?.searchTerm,
          mode: "insensitive",
        },
      }));
    }

    const specialties = await prisma.specialty.findMany({
      where: conditions,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    const total = await prisma.specialty.count({
      where: conditions,
    });

    const meta = {
      page,
      limit,
      total,
    };

    return { specialties, meta };
  },

  specialty: async (_: any, args: { id: string }, { prisma }: TContext) => {
    if (!args.id) {
      throw new AppError(status.BAD_REQUEST, "Specialty ID is required.");
    }

    const specialty = await prisma.specialty.findUnique({
      where: { id: args.id },
    });

    return specialty;
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

  removeSpecialties: async (
    _: any,
    args: { ids: string[] },
    { prisma, currentUser }: TContext
  ) => {
    await auth(prisma, currentUser, [ROLE.ADMIN, ROLE.SUPER_ADMIN]);

    const parsedData = await Specialty.validations.remove.parseAsync(args);

    const specialties = await prisma.specialty.findMany({
      where: { id: { in: parsedData.ids } },
      include: {
        _count: {
          select: {
            doctors: true,
          },
        },
      },
    });

    specialties.forEach((specialty) => {
      if (specialty._count.doctors > 0) {
        throw new AppError(
          status.BAD_REQUEST,
          `Specialty ${specialty.name} is assigned to doctors.`
        );
      }
    });

    const specialtiesToDelete = specialties.map((specialty) => specialty.id);

    await prisma.specialty.deleteMany({
      where: { id: { in: specialtiesToDelete } },
    });

    return { success: true };
  },
};

export const resolvers = { queries, mutations };
