import bcrypt from "bcryptjs";
import app from "../app"; // Import Fastify instance to access Prisma

export default {
  async register({
    email,
    username,
    password,
  }: {
    email: string;
    username: string;
    password: string;
  }) {
    const existingUser = await app.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      throw { status: 409, message: "Email or Username already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await app.prisma.user.create({
      data: { email, username, passwordHash: hashedPassword },
    });
  },
};
