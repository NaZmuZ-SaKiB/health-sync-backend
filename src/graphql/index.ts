import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolver";

const createApolloGraphqlServer = async () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
  });
};

export default createApolloGraphqlServer;
