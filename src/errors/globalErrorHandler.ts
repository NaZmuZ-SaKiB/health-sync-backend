import status from "http-status";
import { GraphQLFormattedError } from "graphql";
import {
  ApolloServerErrorCode,
  unwrapResolverError,
} from "@apollo/server/errors";
import { ZodError } from "zod";
import handleZodError from "./handleZodError";
import AppError from "./AppError";
import config from "../config";

const globalErrorHandler = (
  formattedError: GraphQLFormattedError,
  err: any
) => {
  const error = unwrapResolverError(err);

  let statusCode: number = 500;
  let message: string = "Something went wrong!";
  let errorType: string = "Internal Server Error.";

  //* -----------------------------------
  //* --------- Handle Zod Error --------
  //* -----------------------------------
  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorType = simplifiedError.errorType;
  }

  //* -----------------------------------
  //* ----- Handle GQL Syntax Error -----
  //* -----------------------------------
  else if (
    formattedError.extensions?.code ===
    ApolloServerErrorCode.GRAPHQL_PARSE_FAILED
  ) {
    statusCode = 400;
    message = "Invalid GraphQL syntax";
    errorType = "Bad Request";
  }

  //* -----------------------------------
  //* --- Handle GQL Validation Error ---
  //* -----------------------------------
  else if (
    formattedError.extensions?.code ===
    ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
  ) {
    statusCode = 400;
    message = "GraphQL validation failed";
    errorType = "Validation Error";
  }

  //* -----------------------------------
  //* --- Handle GQL USER INPUT Error ---
  //* -----------------------------------
  else if (
    formattedError.extensions?.code === ApolloServerErrorCode.BAD_USER_INPUT
  ) {
    statusCode = 400;
    message = formattedError.message;
    errorType = "Bad Input";
  }

  //* -----------------------------------
  //* -------- Handle App Error ---------
  //* -----------------------------------
  else if (error instanceof AppError) {
    statusCode = error?.statusCode;
    message = error?.message;
    //@ts-ignore
    errorType = status[statusCode];
  }

  //* -----------------------------------
  //* -------- Handle Other Error -------
  //* -----------------------------------
  else if (error instanceof Error) {
    message = error?.message;
    errorType = error?.name || "Error";
  }

  //* Ultimately return the error object
  return {
    success: false,
    statusCode,
    message,
    errorType,
    stack: config.node_env === "development" ? (error as any)?.stack : null,
    error: config.node_env === "development" ? error : null,
  };
};

export default globalErrorHandler;
