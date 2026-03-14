import express from "express";
import cors from "cors";
import foodsRoutes from "./modules/foods/foods.routes";
import usersRoutes from "./modules/users/users.routes";
import daysRoutes from "./modules/days/days.routes";
import mealsRoutes from "./modules/meals/meals.routes";
import remindersRoutes from "./modules/reminders/reminders.routes";
import reportsRoutes from "./modules/reports/reports.routes";
import authRoutes from "./modules/auth/auth.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "API VIANND funcionando" });
});
app.use("/auth", authRoutes);
app.use("/foods", foodsRoutes);
app.use("/days", daysRoutes);
app.use("/meals", mealsRoutes);
app.use("/reminders", remindersRoutes);
app.use("/reports", reportsRoutes);
app.use("/users", usersRoutes);
app.use(errorMiddleware);

export default app;