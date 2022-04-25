import express from "express";
import { getPlayer, createPlayer, updatePlayer, loginPlayer } from "../controllers/players.js";

const router = express.Router();

// Starting with /players
router.get("/", getPlayer);
router.get("/:id", getPlayer);
router.get("/:name", getPlayer);

router.post("/", createPlayer);
router.post("/login", loginPlayer);

router.patch("/", updatePlayer);

export default router;
