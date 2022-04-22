import express from "express";
import { getSessions, createSession, updateSession } from "../controllers/sessions.js";

const router = express.Router();

// Starting with /sessions
router.get("/", getSessions);

router.post("/", createSession);

export default router;
