import app from "../../app";
import { randomUUID } from "crypto";

export default {
  async refreshToken(refreshToken: string) {
    try {
      app.jwt.verify(refreshToken);
    } catch (error) {
      throw { status: 401, message: "Invalid refresh token" };
    }

    const storedToken = await app.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw { status: 401, message: "Refresh token not recognized" };
    }

    const user = await app.prisma.user.findUnique({ where: { id: storedToken.userId } });
    if (!user) {
      throw { status: 401, message: "User not found" };
    }

    await app.prisma.refreshToken.delete({ where: { token: refreshToken } });

    const newAccessToken = app.jwt.sign(
      {
        email: user.email,
        jti: randomUUID(),
      },
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || "5m" },
    );

    const newRefreshToken = app.jwt.sign(
      { jti: randomUUID() },
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "7d" },
    );

    await app.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: newRefreshToken,
      },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },
};
