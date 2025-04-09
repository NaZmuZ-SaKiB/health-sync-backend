import { hash } from "bcrypt";
import status from "http-status";
import { Doctor } from ".";
import AppError from "../../errors/AppError";
import { TContext } from "../../types";
import { TDoctorCreateInput, TDoctorUpdateInput } from "./doctor.type";
import config from "../../config";
import { Prisma, ROLE } from "@prisma/client";
import auth from "../../utils/auth";

const queries = {};

const mutations = {
  createDoctor: async (
    _: any,
    args: TDoctorCreateInput,
    { prisma }: TContext
  ) => {
    const parsedData = await Doctor.validations.create.parseAsync(args.input);

    const isUserExists = await prisma.user.findFirst({
      where: { email: parsedData.email },
      select: { id: true },
    });

    if (!!isUserExists) {
      throw new AppError(status.CONFLICT, "Email already exists.");
    }

    const isSpecialtyExists = await prisma.specialty.findUnique({
      where: { id: parsedData.doctor.specialtyId },
      select: { id: true },
    });

    if (!isSpecialtyExists) {
      throw new AppError(status.NOT_FOUND, "Specialty not found.");
    }

    const isLocationExists = await prisma.location.findUnique({
      where: { id: parsedData.doctor.locationId },
      select: { id: true },
    });

    if (!isLocationExists) {
      throw new AppError(status.NOT_FOUND, "Location not found.");
    }

    const hashedPassword = await hash(
      config.doctor_default_password as string,
      Number(config.bcrypt_salt_rounds)
    );

    const { doctor, ...userData } = parsedData;

    await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        role: ROLE.DOCTOR,
        doctor: {
          create: doctor,
        },
      },
    });

    return { success: true };
  },

  updateDoctor: async (
    _: any,
    args: TDoctorUpdateInput,
    { prisma, currentUser }: TContext
  ) => {
    await auth(prisma, currentUser, [ROLE.DOCTOR]);

    const parsedData = await Doctor.validations.update.parseAsync(args.input);

    const { doctor, ...user } = parsedData;

    const updateData: Prisma.UserUpdateInput = user;

    if (doctor) {
      updateData.doctor = {
        update: doctor,
      };
    }

    await prisma.user.update({
      where: { id: currentUser?.id },
      data: updateData,
    });

    return { success: true };
  },
};

export const resolvers = { queries, mutations };
