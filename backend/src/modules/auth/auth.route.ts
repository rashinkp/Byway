import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware, protect } from "../../middlewares/authMiddleware";
import { adaptAuthController } from "../../adapters/expressAuthAdapters";

export const createAuthRouter = (authController:AuthController): Router => {
  const authRouter = Router();
  const adapt = adaptAuthController(authController);

  authRouter.post('/registerAdmin', adapt.registerAdmin);
  authRouter.post('/registerUser', adapt.registerUser);
  authRouter.post('/login', adapt.login);
  authRouter.post('/logout', protect , adapt.logout);
  

  return authRouter;
} 