import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware, protect } from "../../middlewares/authMiddleware";
import { adaptUserController } from "../../adapters/expressUserAdapters";

export const createUserRouter = (userController: UserController): Router => {
  const userRouter = Router();
  const adapt = adaptUserController(userController);

  userRouter.put("/users", authMiddleware("USER"), adapt.updateUser);

  userRouter.get("/admin/users", authMiddleware("ADMIN"), adapt.getAllUsers);

  userRouter.put(
    "/admin/:userId",
    authMiddleware("ADMIN"),
    adapt.updateUserByAdmin
  );
  userRouter.get("/users/me", protect, adapt.getUserData);
  userRouter.get("/users/:userId", authMiddleware("ADMIN"), adapt.getUserData);
  userRouter.get("/users/:userId/public", adapt.getPublicUserData);

  return userRouter;
};
