import express from "express";
import { getSessions, getSessionsLive, createSession, updateSession } from "../controllers/sessions.js";

const router = express.Router();

// Starting with /sessions
router.get("/", getSessions);
router.get("/live", getSessionsLive);

router.post("/", createSession);

router.patch("/", updateSession);

export default router;
