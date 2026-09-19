import exprees from "express";
import { login } from "../controllers/auth.controller.js";

const router  = exprees.Router()

router.post("/login",login)

export default router