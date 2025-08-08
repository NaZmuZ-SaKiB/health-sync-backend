import { ROLE } from "@prisma/client";
import { TContext } from "../../types";
import auth from "../../utils/auth";
import { TSettingUpdateInput } from "./setting.type";
import { Setting } from ".";

const queries = {
  settings: async (_: any, args: { keys: string[] }, { prisma }: TContext) => {
    if (!args.keys || args.keys.length === 0) {
      return [];
    }

    return await prisma.setting.findMany({
      where: {
        key: { in: args.keys },
      },
    });
  },

  setting: async (_: any, args: { key: string }, { prisma }: TContext) => {
    if (!args.key) {
      return null;
    }

    return await prisma.setting.findUnique({
      where: {
        key: args.key,
      },
    });
  },
};

const mutations = {
  updateSetting: async (
    _: any,
    args: TSettingUpdateInput,
    { currentUser, prisma }: TContext,
  ) => {
    await auth(prisma, currentUser, [ROLE.ADMIN, ROLE.SUPER_ADMIN]);

    const parsedData = await Setting.validations.update.parseAsync(args);

    await prisma.setting.upsert({
      where: {
        key: parsedData.key,
      },
      create: {
        key: parsedData.key,
        value: parsedData.value,
      },
      update: {
        value: parsedData.value,
      },
    });

    return { success: true };
  },

  updateManySetting: async (
    _: any,
    args: { settings: TSettingUpdateInput[] },
    { currentUser, prisma }: TContext,
  ) => {
    await auth(prisma, currentUser, [ROLE.ADMIN, ROLE.SUPER_ADMIN]);

    const parsedData = await Setting.validations.updateMany.parseAsync(
      args.settings,
    );

    await Promise.all(
      parsedData.map((data: TSettingUpdateInput) =>
        prisma.setting.upsert({
          where: {
            key: data.key,
          },
          create: {
            key: data.key,
            value: data.value,
          },
          update: {
            value: data.value,
          },
        }),
      ),
    );

    return { success: true };
  },
};

export const resolvers = {
  queries,
  mutations,
};
