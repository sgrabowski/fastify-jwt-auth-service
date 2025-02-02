import bcrypt from "bcryptjs";
import app from "../../app";
import { randomUUID } from "crypto";

export default {
  async login({ email, password }: { email: string; password: string }) {
    app.log.info("Login attempt from %s", email);

    const user = await app.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw { status: 401, message: "Invalid email or password" };
    }

    app.log.debug("Creating access and refresh tokens");

    const accessToken = app.jwt.sign({ jti: randomUUID(), email: user.email });
    const refreshToken = app.jwt.sign(
      { jti: randomUUID() },
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "7d" },
    );

    app.log.debug("Saving the refresh token");

    await app.prisma.refreshToken.create({
      data: { userId: user.id, token: refreshToken },
    });

    return { accessToken, refreshToken };
  },
};
