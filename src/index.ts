import { startStandaloneServer } from "@apollo/server/standalone";
import createApolloGraphqlServer from "./graphql";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

type TContext = {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
};

const prisma = new PrismaClient();

const main = async () => {
  const server = await createApolloGraphqlServer();

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async (): Promise<TContext> => {
      return { prisma };
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

main().catch((error) => {
  console.error(error);
});
