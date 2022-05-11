import express from "express";
import { getTeam, createTeam, updateTeam } from "../controllers/team.js";

const router = express.Router();

// Starting with /Teams
router.get("/", getTeam);

router.post("/", createTeam);

router.patch("/", updateTeam);

export default router;
