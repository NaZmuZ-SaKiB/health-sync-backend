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

  homepageSetting: async (_: any, __: any, { prisma }: TContext) => {
    const keys = [
      Setting.constants.CONFIG_HERO_TITLE_TEXT,
      Setting.constants.CONFIG_HERO_SUBTITLE_TEXT,
      Setting.constants.CONFIG_FEATURED_DOCTOR,
      Setting.constants.CONFIG_HERO_REVIEW,
      Setting.constants.CONFIG_HERO_IMAGE,

      Setting.constants.CONFIG_ABOUT_TEXT,
      Setting.constants.CONFIG_ABOUT_LIST,

      Setting.constants.CONFIG_FEATURED_SERVICES,
      Setting.constants.CONFIG_FEATURED_SPECIALTIES,
      Setting.constants.CONFIG_TESTIMONIAL_IMAGE,

      Setting.constants.CONFIG_PRESIDENT_IMAGE,
      Setting.constants.CONFIG_PRESIDENT_NAME,
      Setting.constants.CONFIG_PRESIDENT_POSITION,
      Setting.constants.CONFIG_PRESIDENT_TEXT,
      Setting.constants.CONFIG_PRESIDENT_SKILLS,
      Setting.constants.CONFIG_PRESIDENT_EXPERIENCE,

      Setting.constants.CONFIG_FAQ_ITEMS,
    ];

    const homepageSettings = await prisma.setting.findMany({
      where: {
        key: {
          in: keys,
        },
      },
    });

    const responseData: Record<string, any> = {};

    keys.forEach((key) => {
      const setting = homepageSettings.find((s) => s.key === key);

      if (!setting) return;

      responseData[key] = setting.value;
    });

    if (responseData[Setting.constants.CONFIG_HERO_IMAGE]) {
      responseData[Setting.constants.CONFIG_HERO_IMAGE] =
        await prisma.image.findUnique({
          where: { id: responseData[Setting.constants.CONFIG_HERO_IMAGE] },
          select: {
            id: true,
            publicId: true,
            secureUrl: true,
          },
        });
    }

    if (responseData[Setting.constants.CONFIG_FEATURED_DOCTOR]) {
      responseData[Setting.constants.CONFIG_FEATURED_DOCTOR] =
        await prisma.doctor.findUnique({
          where: { id: responseData[Setting.constants.CONFIG_FEATURED_DOCTOR] },
          select: {
            id: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        });
    }

    if (responseData[Setting.constants.CONFIG_HERO_REVIEW]) {
      responseData[Setting.constants.CONFIG_HERO_REVIEW] =
        await prisma.review.findUnique({
          where: { id: responseData[Setting.constants.CONFIG_HERO_REVIEW] },
          select: {
            id: true,
            rating: true,
            comment: true,
            patient: {
              select: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    profilePicture: {
                      select: {
                        id: true,
                        publicId: true,
                        secureUrl: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
    }

    if (responseData[Setting.constants.CONFIG_FEATURED_SPECIALTIES]) {
      responseData[Setting.constants.CONFIG_FEATURED_SPECIALTIES] =
        await prisma.specialty.findMany({
          where: {
            id: {
              in: JSON.parse(
                responseData[Setting.constants.CONFIG_FEATURED_SPECIALTIES],
              ),
            },
          },
          select: {
            id: true,
            name: true,
            icon: {
              select: {
                id: true,
                publicId: true,
                secureUrl: true,
              },
            },
          },
        });
    }

    if (responseData[Setting.constants.CONFIG_FEATURED_SERVICES]) {
      responseData[Setting.constants.CONFIG_FEATURED_SERVICES] =
        await prisma.service.findMany({
          where: {
            id: {
              in: JSON.parse(
                responseData[Setting.constants.CONFIG_FEATURED_SERVICES],
              ),
            },
          },
          select: {
            id: true,
            name: true,
            icon: {
              select: {
                id: true,
                publicId: true,
                secureUrl: true,
              },
            },
          },
        });
    }

    if (responseData[Setting.constants.CONFIG_TESTIMONIAL_IMAGE]) {
      responseData[Setting.constants.CONFIG_TESTIMONIAL_IMAGE] =
        await prisma.image.findUnique({
          where: {
            id: responseData[Setting.constants.CONFIG_TESTIMONIAL_IMAGE],
          },
          select: {
            id: true,
            publicId: true,
            secureUrl: true,
          },
        });
    }

    if (responseData[Setting.constants.CONFIG_PRESIDENT_IMAGE]) {
      responseData[Setting.constants.CONFIG_PRESIDENT_IMAGE] =
        await prisma.image.findUnique({
          where: {
            id: responseData[Setting.constants.CONFIG_PRESIDENT_IMAGE],
          },
          select: {
            id: true,
            publicId: true,
            secureUrl: true,
          },
        });
    }

    if (responseData[Setting.constants.CONFIG_FAQ_ITEMS]) {
      responseData[Setting.constants.CONFIG_FAQ_ITEMS] = JSON.parse(
        responseData[Setting.constants.CONFIG_FAQ_ITEMS],
      );
    }

    return JSON.stringify(responseData);
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
