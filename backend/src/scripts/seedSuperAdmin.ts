import bcrypt from "bcrypt";

import { connectDatabase } from "../config/db";
import { env } from "../config/env";
import { User } from "../modules/auth/user.model";
import { UserRole } from "../constants/roles";

const seedSuperAdmin = async (): Promise<void> => {
  try {
    console.log("Starting Super Admin seed...");

    await connectDatabase();

    const name = process.env.SUPER_ADMIN_NAME;
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!name || !email || !password) {
      throw new Error(
        "SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required"
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingAdmin = await User.findOne({
      email: normalizedEmail,
    });

    if (existingAdmin) {
      console.log("Super Admin already exists.");

      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    });

    console.log("Super Admin created successfully.");
    console.log(`Email: ${normalizedEmail}`);

    process.exit(0);
  } catch (error) {
    console.error("Super Admin seed failed:", error);

    process.exit(1);
  }
};

seedSuperAdmin();