import bcrypt from "bcrypt";
import { startStandaloneServer } from "@apollo/server/standalone";
import createApolloGraphqlServer from "./graphql";
import { PrismaClient, ROLE } from "@prisma/client";
import { TContext } from "./types";
import { jwtHelpers } from "./utils/jwtHelper";
import config from "./config";

const prisma = new PrismaClient();

const main = async () => {
  const server = await createApolloGraphqlServer();

  // Seed Super Admin
  const isSuperAdminExist = await prisma.user.findFirst({
    where: {
      role: ROLE.SUPER_ADMIN,
    },
    select: { id: true },
  });

  if (!isSuperAdminExist) {
    try {
      const hashPassword = await bcrypt.hash(
        config.super_admin_password as string,
        Number(config.bcrypt_salt_rounds)
      );

      await prisma.user.create({
        data: {
          email: config.super_admin_email as string,
          password: hashPassword,
          role: ROLE.SUPER_ADMIN,
          firstName: "Super",
          lastName: "Admin",
          isActive: true,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }): Promise<TContext> => {
      const token = req.headers.authorization || "";
      let currentUser = null;
      if (token) {
        currentUser = jwtHelpers.verifyToken(
          token,
          config.jwt.jwt_access_token_secret as string
        );
      }
      return {
        prisma,
        currentUser,
      };
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

main().catch((error) => {
  console.error(error);
});
