import { Prisma, PrismaClient, ROLE } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export type TJwtUser = {
  id: string;
  email: string;
  role: ROLE;
};

export type TContext = {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  currentUser: TJwtUser | null;
};

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorType: string;
};

export type TFilters = {
  page?: string;
  limit?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
} & Record<string, any>;
