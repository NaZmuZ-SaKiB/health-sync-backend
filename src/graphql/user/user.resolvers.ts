import status from "http-status";
import { User } from ".";
import config from "../../config";
import AppError from "../../errors/AppError";
import { TContext, TFilters } from "../../types";
import { jwtHelpers } from "../../utils/jwtHelper";
import {
  TUserCretaeInput,
  TUserSigninInput,
  TUserUpdateInput,
} from "./user.type";
import bcrypt from "bcrypt";
import { Prisma, ROLE, User as TUser } from "@prisma/client";
import auth from "../../utils/auth";
import calculatePagination from "../../utils/calculatePagination";

const queries = {
  me: async (_: any, __: any, { prisma, currentUser }: TContext) => {
    await auth(prisma, currentUser);

    const user = await prisma.user.findUnique({
      where: { id: currentUser?.id },
      omit: {
        password: true,
        passwordResetCode: true,
      },
    });

    return user;
  },

  userById: async (
    _: any,
    args: { id: string },
    { prisma, currentUser }: TContext,
  ) => {
    await auth(prisma, currentUser, [ROLE.ADMIN, ROLE.SUPER_ADMIN]);

    const user = await prisma.user.findUnique({
      where: { id: args.id },
      omit: {
        password: true,
        passwordResetCode: true,
      },
    });

    return user;
  },

  getAllAdmins: async (
    _: any,
    queries: TFilters,
    { prisma, currentUser }: TContext,
  ) => {
    await auth(prisma, currentUser, [ROLE.ADMIN, ROLE.SUPER_ADMIN]);

    const { page, limit, skip, sortBy, sortOrder } =
      calculatePagination(queries);

    const conditions: Prisma.UserWhereInput = {};
    conditions.role = ROLE.ADMIN;

    const userSearchableFields = [
      "email",
      "firstName",
      "lastName",
      "phoneNumber",
    ];

    if (queries?.searchTerm) {
      conditions.OR = userSearchableFields.map((field) => ({
        [field]: {
          contains: queries?.searchTerm,
          mode: "insensitive",
        },
      }));
    }

    if (queries?.gender) {
      conditions.gender = queries?.gender;
    }

    const users = await prisma.user.findMany({
      where: conditions,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
      omit: {
        password: true,
        passwordResetCode: true,
      },
    });

    const total = await prisma.user.count({
      where: conditions,
    });

    const meta = {
      page,
      limit,
      total,
    };

    return { users, meta };
  },

  adminById: async (
    _: any,
    { id }: { id: string },
    { currentUser, prisma }: TContext,
  ) => {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    return user;
  },
};

const relationalQuery = {
  User: {
    doctor: async (parent: TUser, _: any, { prisma }: TContext) => {
      return await prisma.doctor.findUnique({
        where: { userId: parent.id },
      });
    },

    patient: async (parent: TUser, _: any, { prisma }: TContext) => {
      return await prisma.patient.findUnique({
        where: { userId: parent.id },
      });
    },

    profilePicture: async (parent: TUser, _: any, { prisma }: TContext) => {
      if (parent.profilePictureId) {
        return await prisma.image.findUnique({
          where: { id: parent.profilePictureId },
        });
      } else {
        return null;
      }
    },
  },
};

const mutations = {
  signup: async (_: any, args: TUserCretaeInput, { prisma }: TContext) => {
    const parsedData = await User.validations.create.parseAsync(args);

    const hashedPassword = await bcrypt.hash(
      parsedData.password,
      Number(config.bcrypt_salt_rounds),
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
      config.jwt.jwt_access_token_expires_in as string,
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
        "Your account is currently inactive.",
      );
    }

    if (isUserExist.role === ROLE.DOCTOR && !isUserExist?.doctor?.isVerified) {
      throw new AppError(
        status.UNAUTHORIZED,
        "Your account is not verified yet.",
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      parsedData.password,
      isUserExist.password,
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
      config.jwt.jwt_access_token_expires_in as string,
    );

    return { token, success: true };
  },

  updateProfile: async (
    _: any,
    args: TUserUpdateInput,
    { currentUser, prisma }: TContext,
  ) => {
    await auth(prisma, currentUser, []);

    const parsedData = await User.validations.update.parseAsync(args);

    const user = await prisma.user.findUnique({
      where: { id: currentUser?.id as string },
      select: { id: true },
    });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found.");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: parsedData,
    });

    return { success: true };
  },

  updateProfilePicture: async (
    _: any,
    args: { id: string },
    { prisma, currentUser }: TContext,
  ) => {
    await auth(prisma, currentUser);

    if (!args.id) {
      throw new AppError(status.BAD_REQUEST, "Image Id is required.");
    }

    await prisma.user.update({
      where: { id: currentUser?.id as string },
      data: {
        profilePictureId: args.id,
      },
    });

    return { success: true };
  },

  updateUserStatus: async (
    _: any,
    args: { id: string },
    { prisma, currentUser }: TContext,
  ) => {
    await auth(prisma, currentUser, [ROLE.ADMIN, ROLE.SUPER_ADMIN]);

    const user = await prisma.user.findUnique({
      where: { id: args.id },
      select: { isActive: true, role: true },
    });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found.");
    }

    if (user.role === ROLE.SUPER_ADMIN) {
      throw new AppError(
        status.FORBIDDEN,
        "Super admin cannot be deactivated.",
      );
    }

    if (user.role === ROLE.ADMIN && currentUser?.role === ROLE.ADMIN) {
      throw new AppError(
        status.FORBIDDEN,
        "Admin cannot deactivate another admin.",
      );
    }

    await prisma.user.update({
      where: { id: args.id },
      data: {
        isActive: !user.isActive,
      },
    });

    return { success: true };
  },

  createAdmin: async (
    _: any,
    args: { email: string },
    { prisma, currentUser }: TContext,
  ) => {
    await auth(prisma, currentUser, [ROLE.SUPER_ADMIN]);

    const parsedData = await User.validations.createAdmin.parseAsync(args);

    const isUserExists = await prisma.user.findUnique({
      where: {
        email: parsedData.email,
      },
    });

    if (isUserExists) {
      throw new AppError(status.CONFLICT, "Email already exist.");
    }

    const hashedPassword = await bcrypt.hash(
      config.admin_default_password as string,
      Number(config.bcrypt_salt_rounds),
    );

    await prisma.user.create({
      data: {
        email: parsedData.email,
        password: hashedPassword,
        needPasswordChange: true,
        role: ROLE.ADMIN,
      },
    });

    return { success: true };
  },

  deleteAdmins: async (
    _: any,
    args: { ids: string[] },
    { currentUser, prisma }: TContext,
  ) => {
    await auth(prisma, currentUser, [ROLE.SUPER_ADMIN]);

    const parsedData = await User.validations.deleteAdmins.parseAsync(args);

    const users = await prisma.user.findMany({
      where: {
        id: { in: parsedData.ids },
      },
    });

    if (!users.length) {
      throw new AppError(status.NOT_FOUND, "Users not found.");
    }

    for (const user of users) {
      if (user.role === ROLE.SUPER_ADMIN) {
        throw new AppError(status.FORBIDDEN, "Super admin cannot be deleted.");
      }
    }

    const userIdsToDelete = users.map((item) => item.id);

    await prisma.user.deleteMany({
      where: {
        id: { in: userIdsToDelete },
      },
    });

    return { success: true };
  },
};

export const resolvers = { queries, mutations, relationalQuery };
