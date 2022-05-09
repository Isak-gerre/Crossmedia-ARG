import express from "express";
import { getGroup, getGroupId, createGroup, updateGroup } from "../controllers/groups.js";

const router = express.Router();

// Starting with /Groups
router.get("/", getGroup);
router.get("/id/:id", getGroupId)

router.post("/", createGroup);

router.patch("/", updateGroup);

export default router;
