import app from "../../app";
import { randomUUID } from "crypto";

export default {
  generateAccessToken(email: string): string {
    return app.jwt.sign(
      {
        email,
        jti: randomUUID(),
      },
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || "5m" },
    );
  },

  generateRefreshToken(): string {
    return app.jwt.sign(
      {
        jti: randomUUID(),
      },
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "7d" },
    );
  },
};
