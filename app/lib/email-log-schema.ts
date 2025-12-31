import { z } from 'zod'

export const EmailRecipientSchema = z.object({
  email: z.string().email(),
  status: z.enum(['SENT', 'FAILED']),
})

export const CreateEmailLogSchema = z.object({
  subject: z.string().min(3),
  templateId: z.string().min(2),
  recipients: z
    .array(EmailRecipientSchema)
    .min(1, 'At least one recipient is required'),
})

