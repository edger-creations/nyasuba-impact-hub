
export interface Donation {
  id: string;
  transaction_id?: string;
  status: 'processing' | 'completed' | 'failed';
  method: 'card' | 'mpesa' | 'bank' | 'cash' | 'other';
  currency: string;
  amount: number;
  user_id?: string;
  program_id?: string;
  program_name?: string;
  user_name?: string;
  date: Date;
}
