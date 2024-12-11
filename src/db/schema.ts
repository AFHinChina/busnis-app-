import { z } from 'zod';

export const accountSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['checking', 'savings', 'credit', 'investment']),
  balance: z.number(),
  currency: z.string(),
  lastSync: z.date().optional(),
});

export const transactionSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  date: z.date(),
  amount: z.number(),
  type: z.enum(['income', 'expense']),
  category: z.string(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
});

export const customerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  totalRevenue: z.number(),
  lastTransaction: z.date().optional(),
});

export const vendorSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  totalExpense: z.number(),
  lastTransaction: z.date().optional(),
});

export type Account = z.infer<typeof accountSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type Customer = z.infer<typeof customerSchema>;
export type Vendor = z.infer<typeof vendorSchema>;