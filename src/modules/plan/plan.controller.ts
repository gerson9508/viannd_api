import { Request, Response, NextFunction } from 'express';
import { getPlanByUser, createPlan, updatePlan } from './plan.service';
import { getAuthUser } from '../../middlewares/auth.middleware';

const VALID_TYPES = ['Omnivoro', 'Vegetariano', 'Vegano', 'Pescetariano'];

export const getPlanController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { userId } = getAuthUser(req);
      const plan = await getPlanByUser(userId);
      if (!plan) return res.status(404).json({ message: 'Sin plan alimenticio' });
      res.json(plan);
   } catch (e) { next(e); }
};

export const createPlanController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { userId } = getAuthUser(req);
      const { dietType, preferredFoods, restrictedFoods } = req.body;

      if (!dietType || !VALID_TYPES.includes(dietType))
         return res.status(400).json({ message: `dietType inválido. Opciones: ${VALID_TYPES.join(', ')}` });
      if (!Array.isArray(preferredFoods))
         return res.status(400).json({ message: 'preferredFoods debe ser un arreglo' });
      if (!Array.isArray(restrictedFoods))
         return res.status(400).json({ message: 'restrictedFoods debe ser un arreglo' });

      const existing = await getPlanByUser(userId);
      if (existing)
         return res.status(409).json({ message: 'Ya tienes un plan. Usa PUT para actualizarlo.' });

      const plan = await createPlan({ userId, dietType, preferredFoods, restrictedFoods });
      res.status(201).json(plan);
   } catch (e) { next(e); }
};

export const updatePlanController = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { userId } = getAuthUser(req);
      const { dietType, preferredFoods, restrictedFoods } = req.body;

      if (dietType !== undefined && !VALID_TYPES.includes(dietType))
         return res.status(400).json({ message: `dietType inválido. Opciones: ${VALID_TYPES.join(', ')}` });
      if (preferredFoods !== undefined && !Array.isArray(preferredFoods))
         return res.status(400).json({ message: 'preferredFoods debe ser un arreglo' });
      if (restrictedFoods !== undefined && !Array.isArray(restrictedFoods))
         return res.status(400).json({ message: 'restrictedFoods debe ser un arreglo' });
      if (!dietType && !preferredFoods && !restrictedFoods)
         return res.status(400).json({ message: 'Envía al menos un campo para actualizar' });

      const plan = await updatePlan(userId, { dietType, preferredFoods, restrictedFoods });
      if (!plan) return res.status(404).json({ message: 'Plan no encontrado' });
      res.json(plan);
   } catch (e) { next(e); }
};
