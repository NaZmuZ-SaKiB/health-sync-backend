import { PrismaClient, ROLE } from "@prisma/client";
import { TJwtUser } from "../types";
import AppError from "../errors/AppError";
import status from "http-status";

const auth = async (
  prisma: PrismaClient,
  user: TJwtUser | null,
  roles?: ROLE[]
) => {
  if (!user) {
    throw new AppError(status.UNAUTHORIZED, "You need to sign-in first.");
  }

  const isUserExists = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      isActive: true,
      role: true,
      doctor: { select: { isVerified: true } },
    },
  });

  if (!isUserExists) {
    throw new AppError(status.UNAUTHORIZED, "User not found.");
  }

  if (!isUserExists.isActive) {
    throw new AppError(
      status.UNAUTHORIZED,
      "You account is currently inactive."
    );
  }

  if (isUserExists.role === ROLE.DOCTOR && !isUserExists.doctor?.isVerified) {
    throw new AppError(status.UNAUTHORIZED, "Your account is not verified.");
  }

  if (roles && roles.length > 0 && !roles.includes(isUserExists.role)) {
    throw new AppError(status.FORBIDDEN, "You are not authorized.");
  }

  return;
};

export default auth;
