import dotenv from "dotenv";
import { connectDB } from "../src/libs/db.js";

dotenv.config();

console.log("Testing connection with string:", process.env.MONGODB_CONNECTIONSTRING);

connectDB().then(() => {
    console.log("SUCCESS: Connected to MongoDB!");
    process.exit(0);
}).catch(err => {
    console.error("FAILURE: Connection failed!");
    console.error(err);
    process.exit(1);
});
