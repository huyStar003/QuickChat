import express from "express";
import {
  createConversation,
  getConversations,
  getMessages,
  markAsSeen,
  addMembersToGroup,
} from "../controllers/conversationController.js";
import { checkFriendship } from "../middlewares/friendMiddleware.js";
import { checkGroupMembership } from "../middlewares/groupMiddleware.js";

const router = express.Router();

router.post("/", checkFriendship, createConversation);
router.get("/", getConversations);
router.get("/:conversationId/messages", getMessages);
router.patch("/:conversationId/seen", markAsSeen);
router.post("/:conversationId/members", checkGroupMembership, addMembersToGroup);

export default router;
