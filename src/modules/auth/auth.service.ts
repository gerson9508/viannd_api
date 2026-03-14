import { comparePassword } from "../../utils/password";
import { generateToken } from "../../utils/jwt";
import { getUserByEmail, createUser } from "../users/users.service";

export const registerUser = async (data: any) => {
  const { email, password, name, age, gender } = data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw Object.assign(new Error("El usuario ya existe"), { status: 409 });
  }

   const newUser = await createUser({ email, password, name, age, gender });

   const token = generateToken(newUser.id);

   return { token, user: newUser };
};

export const loginUser = async (email: string, password: string) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw Object.assign(new Error("Credenciales inválidas"), { status: 401 });
  }

  const validPassword = await comparePassword(password, user.password);

  if (!validPassword) {
    throw Object.assign(new Error("Credenciales inválidas"), { status: 401 });
  }

  const token = generateToken(user.id);
  return { token, user };
};