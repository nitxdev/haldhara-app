
import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

async function startServer() {
  try {
    await connectDatabase();

    app.listen(env.port, () => {
      console.log(`Haldhara API: http://localhost:${env.port}`);
      console.log(`Health check: http://localhost:${env.port}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start Haldhara API:", error);
    process.exit(1);
  }
}

void startServer();
