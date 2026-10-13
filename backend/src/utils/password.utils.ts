import bcrypt from "bcryptjs";

export const GenerateHashedPass = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

export const verifyPass = async (
  regularPass: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(regularPass, hashedPassword);

  return isMatch;
};
