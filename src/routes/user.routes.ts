import express from "express";
import ctrl from "../controllers/users.controllers";
import validateToken from "../middleware/validate.token";
import { checkSecretPassword } from "../middleware/app.middleware";
const userRouter = express.Router();

userRouter.get("/", validateToken, ctrl.getUsers);
userRouter.post("/", checkSecretPassword, ctrl.createUser);
userRouter.patch("/:id", validateToken, ctrl.updateProfile);
userRouter.put("/:id", validateToken, checkSecretPassword, ctrl.updateUser);
userRouter.post("/:id", validateToken, checkSecretPassword, ctrl.softDeleteUser);

export default userRouter;