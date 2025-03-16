import { startStandaloneServer } from "@apollo/server/standalone";
import createApolloGraphqlServer from "./graphql";
import { PrismaClient } from "@prisma/client";
import { TContext } from "./types";
import { jwtHelpers } from "./utils/jwtHelper";
import config from "./config";

const prisma = new PrismaClient();

const main = async () => {
  const server = await createApolloGraphqlServer();

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
