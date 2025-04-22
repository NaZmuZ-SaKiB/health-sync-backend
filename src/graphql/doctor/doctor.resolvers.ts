import { hash } from "bcrypt";
import status from "http-status";
import { Doctor } from ".";
import AppError from "../../errors/AppError";
import { TContext, TFilters } from "../../types";
import { TDoctorCreateInput, TDoctorUpdateInput } from "./doctor.type";
import config from "../../config";
import {
  DOCTOR_VERIFICATION_STATUS,
  Prisma,
  ROLE,
  Doctor as TDoctor,
} from "@prisma/client";
import auth from "../../utils/auth";
import calculatePagination from "../../utils/calculatePagination";

const queries = {
  getAllDoctors: async (_: any, queries: TFilters, { prisma }: TContext) => {
    const { page, limit, skip, sortBy, sortOrder } =
      calculatePagination(queries);

    const andConditions: Prisma.Enumerable<Prisma.DoctorWhereInput> = [];

    // handle search
    const searchableFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "address",
    ];

    if (queries?.searchTerm) {
      andConditions.push({
        OR: [
          ...searchableFields.map((field) => ({
            user: {
              [field]: {
                contains: queries?.searchTerm,
                mode: "insensitive",
              },
            },
          })),
          {
            licenseNumber: {
              contains: queries?.searchTerm,
              mode: "insensitive",
            },
          },
        ],
      });
    }

    // handle filters
    if (queries?.gender)
      andConditions.push({ user: { gender: queries?.gender } });

    if (queries?.specialty)
      andConditions.push({ specialtyId: queries?.specialty });

    if (queries?.location)
      andConditions.push({ locationId: queries?.location });

    if (queries?.isVerified)
      andConditions.push({
        isVerified: queries?.isVerified === "true" ? true : false,
      });

    if (queries?.isDeleted) {
      andConditions.push({
        isDeleted: queries?.isDeleted === "true" ? true : false,
      });
    }

    const doctors = await prisma.doctor.findMany({
      where: {
        AND: andConditions,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    const total = await prisma.doctor.count({
      where: { AND: andConditions },
    });

    const meta = {
      page,
      limit,
      total,
    };

    return { doctors, meta };
  },

  doctor: async (_: any, args: { id: string }, { prisma }: TContext) => {
    if (!args.id) {
      throw new AppError(status.BAD_REQUEST, "Doctor ID is required.");
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: args.id },
    });

    return doctor;
  },
};

const relationalQuery = {
  Doctor: {
    user: async (parent: TDoctor, _: any, { prisma }: TContext) => {
      return await prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },

    specialty: async (parent: TDoctor, _: any, { prisma }: TContext) => {
      return await prisma.specialty.findUnique({
        where: { id: parent.specialtyId },
      });
    },

    location: async (parent: TDoctor, _: any, { prisma }: TContext) => {
      return await prisma.location.findUnique({
        where: { id: parent.locationId },
      });
    },
  },
};

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

    const currentDoctor = await prisma.doctor.findUnique({
      where: { userId: currentUser?.id },
      select: { id: true, isVerified: true },
    });

    if (currentDoctor?.isVerified === false) {
      if (updateData.doctor?.update) {
        updateData.doctor.update.appliedDate = new Date();
      } else {
        updateData.doctor = {
          update: {
            appliedDate: new Date(),
          },
        };
      }
    }

    await prisma.user.update({
      where: { id: currentUser?.id },
      data: updateData,
    });

    return { success: true };
  },

  verifyDoctor: async (
    _: any,
    args: { doctorId: string; status: DOCTOR_VERIFICATION_STATUS },
    { prisma, currentUser }: TContext
  ) => {
    await auth(prisma, currentUser, [ROLE.ADMIN, ROLE.SUPER_ADMIN]);

    const parsedData = await Doctor.validations.verify.parseAsync(args);

    const doctor = await prisma.doctor.findUnique({
      where: { id: parsedData.doctorId },
      select: { id: true },
    });

    if (!doctor) {
      throw new AppError(status.NOT_FOUND, "Doctor not found.");
    }

    const updateData: Prisma.DoctorUpdateInput = {
      verificationStatus: parsedData.status,
    };

    if (parsedData.status === DOCTOR_VERIFICATION_STATUS.VERIFIED) {
      updateData.isVerified = true;
    } else if (parsedData.status === DOCTOR_VERIFICATION_STATUS.REJECTED) {
      updateData.isVerified = false;
    }

    await prisma.doctor.update({
      where: { id: parsedData.doctorId },
      data: updateData,
    });

    return { success: true };
  },
};

export const resolvers = { queries, mutations, relationalQuery };
