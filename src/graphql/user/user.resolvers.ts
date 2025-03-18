import status from "http-status";
import { User } from ".";
import config from "../../config";
import AppError from "../../errors/AppError";
import { TContext } from "../../types";
import { jwtHelpers } from "../../utils/jwtHelper";
import { TUserCretaeInput, TUserSigninInput } from "./user.type";
import bcrypt from "bcrypt";
import { ROLE } from "@prisma/client";

const queries = {
  me: () => "Hello, World!",
};

const mutations = {
  signup: async (_: any, args: TUserCretaeInput, { prisma }: TContext) => {
    const parsedData = await User.validations.create.parseAsync(args);

    const hashedPassword = await bcrypt.hash(
      parsedData.password,
      Number(config.bcrypt_salt_rounds)
    );

    const isUserExist = await prisma.user.findFirst({
      where: {
        email: parsedData.email,
      },
      select: {
        id: true,
      },
    });

    if (!!isUserExist) {
      throw new AppError(status.CONFLICT, "Email already exist.");
    }

    const user = await prisma.user.create({
      data: {
        email: parsedData.email,
        password: hashedPassword,
        patient: {
          create: {},
        },
      },
    });

    const token = jwtHelpers.generateToken(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      config.jwt.jwt_access_token_secret as string,
      config.jwt.jwt_access_token_expires_in as string
    );

    return { token, success: true };
  },

  signin: async (_: any, args: TUserSigninInput, { prisma }: TContext) => {
    const parsedData = await User.validations.signin.parseAsync(args);

    const isUserExist = await prisma.user.findFirst({
      where: {
        email: parsedData.email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        isActive: true,
        doctor: {
          select: {
            isVerified: true,
          },
        },
      },
    });

    if (!isUserExist) {
      throw new AppError(status.UNAUTHORIZED, "Invalid email or password.");
    }

    if (!isUserExist.isActive) {
      throw new AppError(
        status.UNAUTHORIZED,
        "Your account is currently inactive."
      );
    }

    if (isUserExist.role === ROLE.DOCTOR && !isUserExist?.doctor?.isVerified) {
      throw new AppError(
        status.UNAUTHORIZED,
        "Your account is not verified yet."
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      parsedData.password,
      isUserExist.password
    );

    if (!isPasswordMatch) {
      throw new AppError(status.UNAUTHORIZED, "Invalid email or password.");
    }

    const token = jwtHelpers.generateToken(
      {
        id: isUserExist.id,
        email: isUserExist.email,
        role: isUserExist.role,
      },
      config.jwt.jwt_access_token_secret as string,
      config.jwt.jwt_access_token_expires_in as string
    );

    return { token, success: true };
  },
};

export const resolvers = { queries, mutations };
