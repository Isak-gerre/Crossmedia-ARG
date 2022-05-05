import express from "express";
import { getPhase1 } from "../controllers/phase1.js";
import { getPhase2, getChallange2 } from "../controllers/phase2.js";
import { getPhase3 } from "../controllers/phase3.js";

const router = express.Router();

// Starting with /challenges
router.get("/phase1", getPhase1);

router.get("/phase2", getPhase2);
router.get("/phase2/answer", getChallange2);

router.get("/phase3", getPhase3);

export default router;
