import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { EmailLogDB } from "./type";
import path from "path";

const isServerless = process.env.VERCEL;
const filePath = isServerless
  ? path.join("/tmp", "email-logs.json")
  : path.join(process.cwd(), "data/email-logs.json");

const adapter = new JSONFile<EmailLogDB>(filePath);

const db = new Low<EmailLogDB>(adapter, { emailLogs: [] });

export async function initEmailLogDB() {
  await db.read();
  db.data ||= { emailLogs: [] };
  await db.write();
}

initEmailLogDB();

export default db;
