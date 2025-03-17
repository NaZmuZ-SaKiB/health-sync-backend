import { Prisma, ROLE } from "@prisma/client";
import { TContext } from "../../types";
import auth from "../../utils/auth";
import { TPatientUpdateInput } from "./patient.type";
import { Patient } from ".";

const queries = {};

const mutations = {
  UpdatePatient: async (
    _: any,
    args: TPatientUpdateInput,
    { prisma, currentUser }: TContext
  ) => {
    auth(currentUser, [ROLE.PATIENT]);

    const parsedData = await Patient.validations.update.parseAsync(args.input);

    const { patient, ...user } = parsedData;

    const updateData: Prisma.UserUpdateInput = user as Prisma.UserUpdateInput;

    if (patient) {
      updateData.patient = {
        update: patient as Prisma.PatientUpdateInput,
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
