import { ROLE } from "@prisma/client";
import { TJwtUser } from "../types";
import AppError from "../errors/AppError";
import status from "http-status";

const auth = (user: TJwtUser | null, roles?: ROLE[]) => {
  if (!user) {
    throw new AppError(status.UNAUTHORIZED, "You need to sign-in first.");
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    throw new AppError(status.FORBIDDEN, "You are not authorized.");
  }

  return;
};

export default auth;
