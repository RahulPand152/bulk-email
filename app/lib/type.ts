export type EmailStatus = "SENT" | "FAILED";

export interface EmailRecipientLog {
  to: string;
  status: EmailStatus;
}

export interface EmailLog {
  id: string;
  subject: string;
  sentAt: string; // ISO string
  totalRecipients: number;
  sent: number;
  failed: number;
  recipients: EmailRecipientLog[];
}

export interface EmailLogDB {
  emailLogs: EmailLog[];
}
