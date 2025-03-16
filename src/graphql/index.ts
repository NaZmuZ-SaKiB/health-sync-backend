import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolver";
import globalErrorHandler from "../errors/globalErrorHandler";

const createApolloGraphqlServer = async () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    formatError: globalErrorHandler,
  });
};

export default createApolloGraphqlServer;
