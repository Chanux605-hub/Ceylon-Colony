// routes/workshop.routes.js
import { Router } from "express";
import { create, list, get, update, remove, setStatus, cancel } from "../controllers/workshopController.js";

const router = Router();

router.post("/", create);
router.get("/", list);
router.get("/:id", get);

// Put the more specific path BEFORE the generic "/:id"
router.patch("/:id/status", setStatus);

router.put("/:id", update);
router.patch("/:id", update);   // optional, supports PATCH edits too
router.delete("/:id", remove);

router.post("/:id/cancel", cancel); // optional convenience
export default router;
