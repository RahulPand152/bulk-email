export type EmailStatus = 'SENT' | 'FAILED'

export interface EmailRecipientLog {
  email: string
  status: EmailStatus
  error?:string
}

export interface EmailLog {
  id: string
  subject: string
  templateId: string
  sentAt: string // ISO string
  totalRecipients: number
  sent: number
  failed: number
  recipients: EmailRecipientLog[]
}

export interface EmailLogDB {
  emailLogs: EmailLog[]
}
