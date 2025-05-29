import { Patient as TPatient, Prisma, ROLE } from "@prisma/client";
import { TContext, TFilters } from "../../types";
import auth from "../../utils/auth";
import { TPatientUpdateInput } from "./patient.type";
import { Patient } from ".";
import calculatePagination from "../../utils/calculatePagination";

const queries = {
  getAllPatients: async (
    _: any,
    queries: TFilters,
    { prisma, currentUser }: TContext,
  ) => {
    await auth(prisma, currentUser, [ROLE.ADMIN, ROLE.SUPER_ADMIN]);

    const { page, limit, skip, sortBy, sortOrder } =
      calculatePagination(queries);

    const andConditions: Prisma.Enumerable<Prisma.PatientWhereInput> = [];

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
            emergencyContactPhone: {
              contains: queries?.searchTerm,
              mode: "insensitive",
            },
          },
          {
            emergencyContactName: {
              contains: queries?.searchTerm,
              mode: "insensitive",
            },
          },
        ],
      });
    }

    // handle filters
    if (queries?.gender) {
      andConditions.push({ user: { gender: queries?.gender } });
    }

    if (queries?.bloodGroup) {
      andConditions.push({
        bloodGroup: queries?.bloodGroup,
      });
    }

    const patients = await prisma.patient.findMany({
      where: {
        AND: andConditions,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    const total = await prisma.patient.count({
      where: { AND: andConditions },
    });

    const meta = {
      page,
      limit,
      total,
    };

    return { patients, meta };
  },
};

const relationalQuery = {
  Patient: {
    user: async (parent: TPatient, _: any, { prisma }: TContext) => {
      return await prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
  },
};

const mutations = {
  updatePatient: async (
    _: any,
    args: TPatientUpdateInput,
    { prisma, currentUser }: TContext,
  ) => {
    await auth(prisma, currentUser, [ROLE.PATIENT]);

    const parsedData = await Patient.validations.update.parseAsync(args.input);

    const { patient, ...user } = parsedData;

    const updateData: Prisma.UserUpdateInput = user;

    if (patient) {
      updateData.patient = {
        update: patient,
      };
    }

    const result = await prisma.user.update({
      where: { id: currentUser?.id },
      data: updateData,
      include: { patient: true, profilePicture: true },
    });

    return result;
  },
};

export const resolvers = { queries, relationalQuery, mutations };
