import { comparePassword } from "../../utils/password";
import { generateToken } from "../../utils/jwt";
import { getUserByEmail, createUser } from "../users/users.service";
import { saveCode, verifyCode, canRequestCode } from "../../utils/verification-store";
import { sendVerificationCode } from "../../utils/email";

export const sendEmailVerification = async (data: any) => {
   const { email, name } = data;

   if (!email || !name) {
      throw Object.assign(new Error("email y name son requeridos"), { status: 400 });
   }

   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email)) {
      throw Object.assign(new Error("Formato de email inválido"), { status: 400 });
   }

   const cooldown = canRequestCode(email);
   if (!cooldown.allowed) {
      throw Object.assign(
         new Error(`Debes esperar ${cooldown.waitMinutes} minutos para solicitar un nuevo código`),
         { status: 429 }
      );
   }

   const existingEmail = await getUserByEmail(email);
   if (existingEmail) {
      throw Object.assign(new Error("Este correo ya está registrado"), { status: 409 });
   }

   const code = "123456"; // Math.floor(100000 + Math.random() * 900000).toString();
   saveCode(email, code);
   // await sendVerificationCode(email, code);
};

export const verifyAndRegister = async (data: any) => {
   const { email, code, name, password, age, gender } = data;

   if (!email || !code || !name || !password || !age || !gender) {
      throw Object.assign(new Error("Todos los campos son requeridos"), { status: 400 });
   }

   if (!verifyCode(email, code)) {
      throw Object.assign(new Error("Código inválido o expirado"), { status: 400 });
   }

   const newUser = await createUser({ email, password, name, age, gender });
   const token = generateToken(newUser.id);
   return { token, user: newUser };
};

export const registerUser = async (data: any) => {
   const { email, password, name, age, gender } = data;

   const existingUser = await getUserByEmail(email);
   if (existingUser) {
      throw Object.assign(new Error("El correo ya existe"), { status: 409 });
   }

   const newUser = await createUser({ email, password, name, age, gender });
   const token = generateToken(newUser.id);
   return { token, user: newUser };
};

export const loginUser = async (email: string, password: string) => {
   if (!email || !password) {
      throw Object.assign(new Error("email y password son requeridos"), { status: 400 });
   }

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
