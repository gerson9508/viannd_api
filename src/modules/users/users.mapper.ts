import { User } from "./users.types";

export const mapUserResponse = (user: User) => {
   return {
      id: user.id,
      email: user.email,
      name: user.name,
      age: user.age,
      gender: user.gender,
      dailyKcal: user.dailyKcal,
   };
};
