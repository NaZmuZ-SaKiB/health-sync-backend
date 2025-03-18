import { hash } from "bcrypt";
import status from "http-status";
import { Doctor } from ".";
import AppError from "../../errors/AppError";
import { TContext } from "../../types";
import { TDoctorCreateInput } from "./doctor.type";
import config from "../../config";
import { ROLE } from "@prisma/client";

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
};

export const resolvers = { queries, mutations };
