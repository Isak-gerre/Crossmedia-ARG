import express from "express";
import { getPhase1 } from "../controllers/phase1.js";
import { getPhase2, getChallenge2 } from "../controllers/phase2.js";
import { getPhase3, checkAnswer, getCable, getChallenge3} from "../controllers/phase3.js";

const router = express.Router();

// Starting with /challenges
router.get("/phase1", getPhase1);

router.get("/phase2", getPhase2);
router.get("/phase2/answer", getChallenge2);

router.get("/phase3", getPhase3);
router.get("/phase3/get", getChallenge3);

router.post("/cables", checkAnswer);
router.post("/cgame", getCable);

export default router;
