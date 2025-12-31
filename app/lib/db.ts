import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { EmailLogDB } from './type'
import path from 'path'

// File location
const filePath = path.join(process.cwd(), 'data/email-logs.json')

// Adapter
const adapter = new JSONFile<EmailLogDB>(filePath)

// DB instance
const db = new Low<EmailLogDB>(adapter, { emailLogs: [] })

export async function initEmailLogDB() {
  await db.read()
  db.data ||= { emailLogs: [] }
  await db.write()
}

initEmailLogDB()

export default db
