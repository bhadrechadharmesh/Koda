import exprees from "express";
import { login, logout } from "../controllers/auth.controller.js";

const router = exprees.Router();

router.post("/login", login);
router.get("/logout", logout);

export default router;