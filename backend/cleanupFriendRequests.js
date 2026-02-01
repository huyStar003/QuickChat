// Script để xóa tất cả friend requests cũ trong database
// Chạy script này một lần để reset dữ liệu test

import mongoose from "mongoose";
import dotenv from "dotenv";
import FriendRequest from "./src/models/FriendRequest.js";

dotenv.config();

const cleanupFriendRequests = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        const result = await FriendRequest.deleteMany({});
        console.log(`🗑️  Deleted ${result.deletedCount} friend requests`);

        await mongoose.connection.close();
        console.log("✅ Database connection closed");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

cleanupFriendRequests();
