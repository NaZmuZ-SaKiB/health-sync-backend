import { GENDER } from "@prisma/client";

export type TUserCretaeInput = {
  email: String;
  password: String;
  confirmPassword: String;
};

export type TUserUpdateInput = {
  firstName?: String;
  lastName?: String;
  phoneNumber?: String;
  address?: String;
  dateOfBirth?: String;
  gender?: GENDER;
};

export type TUserSigninInput = {
  email: String;
  password: String;
};
