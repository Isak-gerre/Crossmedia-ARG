import express from "express";
import {
	getSessions,
	getSessionsLive,
	createSession,
	updateSession,
	getAllPlayersInSession,
} from "../controllers/sessions.js";

const router = express.Router();

// Starting with /sessions
router.get("/", getSessions);
router.get("/live", getSessionsLive);
router.get("/live/users", getAllPlayersInSession);

router.post("/", createSession);

router.patch("/", updateSession);

export default router;
