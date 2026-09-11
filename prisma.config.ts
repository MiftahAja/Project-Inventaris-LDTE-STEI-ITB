import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Use DIRECT_URL (session mode) for migrations, DATABASE_URL (transaction mode) for queries
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
