import express from "express";
import { getGroup, getGroupId, createGroup, updateGroup, updatePlayers } from "../controllers/groups.js";

const router = express.Router();

// Starting with /Groups
router.get("/", getGroup);
router.get("/id/:id", getGroupId);

router.post("/", createGroup);

router.patch("/", updateGroup);
router.patch("/updateplayers", updatePlayers);

export default router;
