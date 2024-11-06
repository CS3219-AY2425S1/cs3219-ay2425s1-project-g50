import express from "express";

import { handleLogin, handleVerifyToken } from "../controller/auth-controller.js";
import { verifyAccessToken, verifyIsAdmin, verifyIsOwnerOrAdmin } from "../middleware/basic-access-control.js";

const router = express.Router();

router.post("/login", handleLogin);

router.get("/verify-token", verifyAccessToken, handleVerifyToken);

router.get("/verify-owner", verifyAccessToken, verifyIsOwnerOrAdmin, handleVerifyToken);

router.get("/verify-admin", verifyAccessToken, verifyIsAdmin, handleVerifyToken);

export default router;
