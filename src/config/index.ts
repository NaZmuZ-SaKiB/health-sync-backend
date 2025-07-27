import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,

  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  super_admin_email: process.env.SUPER_ADMIN_EMAIL,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,

  doctor_default_password: process.env.DOCTOR_DEFAULT_PASSWORD,
  admin_default_password: process.env.ADMIN_DEFAULT_PASSWORD,

  jwt: {
    jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    jwt_access_token_expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    jwt_reset_password_token_secret:
      process.env.JWT_RESET_PASSWORD_TOKEN_SECRET,
    jwt_reset_password_token_expires_in:
      process.env.JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN,
  },
};
