import { ZodError, ZodIssue } from "zod";
import { TGenericErrorResponse } from "../types";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const message = err.issues.map((issue: ZodIssue) => issue.message).join(", ");

  return {
    statusCode: 403,
    message,
    errorType: "Validation Error.",
  };
};

export default handleZodError;
