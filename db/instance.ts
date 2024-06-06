import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sqlite = new Database(__dirname + "/data.db");
const db = drizzle(sqlite);

export { db };
