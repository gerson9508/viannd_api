import { Router } from "express";
import { loginController, registerController, sendCodeController } from "./auth.controller";

const router = Router();

router.post('/send-code', sendCodeController);   
router.post('/register', registerController);   
router.post('/login', loginController);

export default router;