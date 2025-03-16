import status from "http-status";
import { User } from ".";
import config from "../../config";
import AppError from "../../errors/AppError";
import { TContext } from "../../types";
import { jwtHelpers } from "../../utils/jwtHelper";
import { TUserCretaeInput, TUserSigninInput } from "./user.type";
import bcrypt from "bcrypt";

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
      throw new AppError(status.CONFLICT, "User already exist");
    }

    const user = await prisma.user.create({
      data: {
        email: parsedData.email,
        password: hashedPassword,
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

    return { token };
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
      },
    });

    if (!isUserExist) {
      throw new AppError(status.UNAUTHORIZED, "Invalid email or password");
    }

    const isPasswordMatch = await bcrypt.compare(
      parsedData.password,
      isUserExist.password
    );

    if (!isPasswordMatch) {
      throw new AppError(status.UNAUTHORIZED, "Invalid email or password");
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

    return { token };
  },
};

export const resolvers = { queries, mutations };
