import Conversation from "../models/Conversation.js";

export const checkGroupMembership = async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ message: "Nhóm không tồn tại" });
        }

        if (conversation.type !== "group") {
            return res.status(400).json({ message: "Không phải nhóm chat" });
        }

        const isMember = conversation.participants.some(
            (p) => p.userId.toString() === userId.toString()
        );

        if (!isMember) {
            return res.status(403).json({ message: "Bạn không phải thành viên của nhóm" });
        }

        next();
    } catch (error) {
        console.error("Error in checkGroupMembership:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
