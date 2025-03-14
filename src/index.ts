import { startStandaloneServer } from "@apollo/server/standalone";
import createApolloGraphqlServer from "./graphql";

const main = async () => {
  const server = await createApolloGraphqlServer();

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

main().catch((error) => {
  console.error(error);
});
