import bcrypt from "bcrypt";
import { User } from "./user.model";
import { generateAccessToken } from "../../utils/jwt";

interface LoginInput {
  email: string;
  password: string;
}

export const loginUser = async ({
  email,
  password,
}: LoginInput) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("User account is inactive");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  user.lastLoginAt = new Date();

  await user.save();

  const accessToken = generateAccessToken(
    user._id.toString(),
    user.role,
    user.schoolId?.toString()
  );

  return {
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
    },
  };
};