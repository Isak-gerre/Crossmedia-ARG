import express from "express";
import { getGroup, createGroup, updateGroup } from "../controllers/groups.js";

const router = express.Router();

// Starting with /Groups
router.get("/", getGroup);

router.post("/", createGroup);

router.patch("/", updateGroup);

export default router;
