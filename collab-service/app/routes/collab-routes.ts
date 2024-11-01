import express from "express";

import { create_room } from "../controller/collab-controller";

const router = express.Router();

router.post("/create-room", create_room);

export default router;