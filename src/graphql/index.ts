import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolver";

const createApolloGraphqlServer = async () => {
  const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await graphqlServer.start();

  return graphqlServer;
};

export default createApolloGraphqlServer;
